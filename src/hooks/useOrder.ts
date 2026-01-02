import { createOrder, getOrder, addOrder, cancelOrder } from '@/app/api/order';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { ApiErrorBody } from '@/lib/error';
import { OrderRequest, OrderResponse } from '@/lib/schemas/order';
import { orderKeys, tableKeys } from '@/lib/queries/keys';
import { captureDomainError } from '@/lib/sentry/capture';

export function useOrder(orderId?: number) {
  return useQuery<OrderResponse>({
    queryKey: orderKeys.detail(orderId!),
    queryFn: () => getOrder(orderId as number),
    staleTime: 60 * 5 * 1000,
    enabled: !!orderId,
    refetchOnMount: 'always',
    retry: false,
  });
}

export function useCreateOrder(tableId: number) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<OrderResponse, AxiosError<ApiErrorBody>, OrderRequest>({
    mutationFn: (payload) => createOrder(tableId, payload),
    onSuccess: (order) => {
      toast.success('주문이 접수되었습니다.');
      console.log(order);

      router.push('/pos/tables');
      queryClient.invalidateQueries({ queryKey: tableKeys.all });
    },
    onError: (err, payload) => {
      toast.error('주문 처리에 실패했습니다.');

      captureDomainError({
        error: err,
        feature: 'order',
        action: 'create',
        level: 'error',
        context: {
          tableId,
          itemsCount: payload?.orderItems?.length,
          status: err?.response?.status,
          apiMessage: err?.response?.data?.message,
          optimistic: false,
        },
      });

      console.error('status:', err?.response?.status);
      console.error('data:', err?.response?.data);
    },
  });
}

export function useAddOrder(orderId: number) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<
    OrderResponse,
    AxiosError<ApiErrorBody>,
    OrderRequest,
    { prevOrder?: OrderResponse }
  >({
    mutationFn: (payload) => addOrder(orderId, payload),

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(orderId) });

      const prevOrder = queryClient.getQueryData<OrderResponse>([
        orderKeys.detail(orderId),
      ]);

      if (prevOrder) {
        const optimisticItems = payload.orderItems.map((item, idx) => ({
          orderItemId: -(Date.now() + idx),
          menuId: item.menuId,
          menuName: '주문 중...',
          quantity: item.quantity,
          itemPrice: 0,
          totalItemPrice: 0,
        }));

        const nextItems = [...(prevOrder.orderItems ?? []), ...optimisticItems];

        const optimistic: OrderResponse = {
          ...prevOrder,
          orderItems: nextItems,
          status: 'ORDERED',
        };

        queryClient.setQueryData(orderKeys.detail(orderId), optimistic);
      }

      return { prevOrder };
    },

    onSuccess: () => {
      toast.success('주문이 접수되었습니다.');

      router.push('/pos/tables');
      queryClient.invalidateQueries({ queryKey: tableKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
    },

    onError: (err, payload, context) => {
      const rolledBack = !!context?.prevOrder;

      if (context?.prevOrder) {
        queryClient.setQueryData(orderKeys.detail(orderId), context.prevOrder);
      }

      toast.error('주문 처리에 실패했습니다.');

      captureDomainError({
        error: err,
        feature: 'order',
        action: 'add',
        level: 'error',
        context: {
          orderId,
          itemsCount: payload?.orderItems?.length,
          status: err?.response?.status,
          apiMessage: err?.response?.data?.message,
          optimistic: true,
          rolledBack,
        },
      });

      console.error('status:', err?.response?.status);
      console.error('data:', err?.response?.data);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: tableKeys.all });
    },
  });
}

export function useCancelOrder(orderId: number) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<
    OrderResponse,
    AxiosError<ApiErrorBody>,
    void,
    { prevOrder?: OrderResponse }
  >({
    mutationFn: () => cancelOrder(orderId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(orderId) });

      const prevOrder = queryClient.getQueryData<OrderResponse>([
        orderKeys.detail(orderId),
      ]);

      if (prevOrder) {
        const optimistic: OrderResponse = {
          ...prevOrder,
          orderItems: [],
          totalPrice: 0,
          status: 'EMPTY',
        };

        queryClient.setQueryData(orderKeys.detail(orderId), optimistic);
      }

      return { prevOrder };
    },

    onSuccess: (serverOrder) => {
      toast.success('주문이 취소되었습니다.');

      queryClient.setQueryData(orderKeys.detail(orderId), serverOrder);
      router.push('/pos/tables');
    },

    onError: (err, _payload, context) => {
      const rolledBack = !!context?.prevOrder;

      if (rolledBack) {
        queryClient.setQueryData(orderKeys.detail(orderId), context.prevOrder);
      }

      toast.error('주문 취소에 실패했습니다.');

      captureDomainError({
        error: err,
        feature: 'order',
        action: 'cancel',
        level: 'error',
        context: {
          orderId,
          status: err?.response?.status,
          apiMessage: err?.response?.data?.message,
          optimistic: true,
          rolledBack,
        },
      });

      console.error('status:', err?.response?.status);
      console.error('data:', err?.response?.data);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tableKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
    },
  });
}
