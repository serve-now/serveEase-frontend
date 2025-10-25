'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SplitPaymentModal from './_components/SplitPaymentModal';
import BackButton from '@/components/BackButton';
import PaymentTypeBtn from './_components/PaymentTypeBtn';
import OrderCheck2 from './_components/OrderCheck2';
import { useOrder } from '@/hooks/useOrder';
import useTossPayments from '@/hooks/payment/useTossPayments';
import {
  useCashPayment,
  useCashPaymentFull,
} from '@/hooks/payment/usePaymentsCash';
import { toast } from 'sonner';

const paymentMethod = [
  { title: '💳', name: '신용 카드' },
  { title: '💰', name: '현금' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();
  const orderIdParam = params.get('orderId');
  const orderId = orderIdParam ? Number(orderIdParam) : undefined;

  const { data: order, isLoading } = useOrder(orderId);
  useEffect(() => {
    if (order?.restaurantTableId) {
      localStorage.setItem(
        'lastPaymentTableId',
        String(order.restaurantTableId),
      );
    }

    if (order?.id || orderId) {
      localStorage.setItem(
        'lastPaymentOrderId',
        String(order?.id ?? orderId), // CHANGED
      );
    }
  }, [order?.restaurantTableId, order?.id, orderId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partialAmount, setPartialAmount] = useState<number | null>(null);

  const totalAmount = order?.totalPrice ?? 0;
  const remainingAmount = order?.remainingAmount ?? totalAmount;

  // 카드 결제
  const { requestPayment } = useTossPayments(
    order?.id ? String(order.id) : undefined,
  );

  // 현금 결제 훅
  const cashPartial = useCashPayment();
  const cashFull = useCashPaymentFull();

  const paymentAmount = partialAmount ?? remainingAmount;

  const validateAmount = (amt: number) => {
    if (amt <= 0) {
      toast.error('결제 금액이 올바르지 않습니다.');
      return false;
    }
    if (amt > remainingAmount) {
      toast.error('남은 금액을 초과할 수 없습니다.');
      return false;
    }
    return true;
  };

  const handleCreditCardPayment = async () => {
    if (!order) return;
    if (!validateAmount(paymentAmount)) return;

    await requestPayment({
      parentOrderId: order.orderId, // 내부 주문의 문자열형 orderId (parent)
      tableId: order.restaurantTableId,
      orderData: {
        totalPrice: paymentAmount, // 이번 결제 금액
        orderItems: order.orderItems.map((item) => ({
          menuName: item.menuName,
          quantity: item.quantity,
        })),
      },
    });
  };

  const handleCashPayment = async () => {
    if (!order) return;

    const storedOrderId = Number(localStorage.getItem('lastPaymentOrderId'));
    if (!storedOrderId) {
      toast.error('주문 정보를 찾을 수 없습니다.');
      return;
    }

    const paymentAmount = partialAmount ?? remainingAmount;

    if (paymentAmount <= 0) {
      toast.error('결제 금액이 올바르지 않습니다.');
      return;
    }
    if (paymentAmount > remainingAmount) {
      toast.error('남은 금액을 초과할 수 없습니다.');
      return;
    }

    try {
      if (paymentAmount === remainingAmount) {
        // 전액 현금 결제
        await cashFull.mutateAsync({ orderId: storedOrderId });
        toast.success('결제가 완료되었습니다.');
        localStorage.removeItem('lastPaymentOrderId');
        localStorage.removeItem('lastPaymentTableId');
        localStorage.removeItem(`split-count:${order.orderId}`);
        // router.replace('/pos/tables');
      } else {
        // 분할 현금 결제
        await cashPartial.mutateAsync({
          orderId: storedOrderId,
          amount: paymentAmount,
        });
        toast.success(`${paymentAmount}원 결제가 완료되었습니다.`);
        localStorage.setItem(
          'lastPaymentTableId',
          String(order.restaurantTableId),
        );
        localStorage.setItem('lastPaymentOrderId', String(order.id));
        // router.replace(
        //   `/pos/tables/${order.restaurantTableId}/checkout?orderId=${order.id}`,
        // );
      }
    } catch {
      toast.error('현금 결제에 실패했습니다.');
    }
  };

  return (
    <>
      <div className="grid grid-cols-[1fr_clamp(18rem,24vw,22rem)] gap-10 min-h-screen">
        <section className="pt-10 pl-12 pr-6 flex flex-col min-h-screen">
          <BackButton buttonStyle="w-14 mb-8" iconStyle="size-5" />

          <div className="mx-auto w-full max-w-3xl flex-1 min-h-0 flex flex-col space-y-8">
            {/* 상단 블록 */}
            <div className="flex-none border-b border-gray-200 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-semibold leading-snug">
                    총 결제 금액
                  </div>
                  <div className="mt-3 text-4xl font-bold tracking-tight">
                    {totalAmount.toLocaleString()}원을 결제할게요
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#e6f3ff] text-[#3B82F6] px-6 py-3 rounded-md cursor-pointer hover:bg-[#d9ecff] transition-colors duration-200 "
                >
                  분할 결제
                </button>
              </div>

              <div className="mt-5 w-full sm:max-w-md md:max-w-lg lg:max-w-xl rounded-lg border border-gray-200 bg-gray-50/60 p-5">
                <dl className="grid grid-cols-[1fr_auto] gap-y-2.5 text-sm">
                  <dt className="text-gray-500">총 결제</dt>
                  <dd className="tabular-nums font-medium">
                    {totalAmount.toLocaleString()}원
                  </dd>

                  <dt className="text-gray-500">이번 결제</dt>
                  <dd className="tabular-nums font-semibold text-[#3B82F6]">
                    {(partialAmount ?? remainingAmount).toLocaleString()}원
                  </dd>

                  <dt className="text-gray-500">남은 금액</dt>
                  <dd className="tabular-nums font-semibold">
                    {partialAmount
                      ? (remainingAmount - partialAmount).toLocaleString() +
                        '원'
                      : remainingAmount.toLocaleString() + '원'}
                  </dd>
                </dl>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <div className="flex items-end gap-3">
                <span className="text-xl font-semibold">결제 방법</span>
                <span className="text-lg font-semibold text-[#3B82F6]">
                  고객도 선택 가능
                </span>
              </div>

              <div className="mt-5 flex gap-5">
                {paymentMethod.map(({ title, name }, key) => (
                  <PaymentTypeBtn
                    key={key}
                    title={title}
                    name={name}
                    onClick={
                      name === '신용 카드'
                        ? handleCreditCardPayment
                        : name === '현금'
                        ? handleCashPayment
                        : undefined
                    }
                    disabled={
                      isLoading ||
                      !order ||
                      cashPartial.isPending ||
                      cashFull.isPending
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="sticky top-0 h-[100vh] bg-[#f3f4f5]">
          <div className="h-full overflow-auto">
            <div className="min-h-full flex">
              <div className="mt-30 my-auto mx-auto w-full max-w-[22rem] px-5 py-0">
                <OrderCheck2 order={order} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* 분할 금액 입력 모달 */}
      <SplitPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        totalAmount={totalAmount}
        remainingAmount={remainingAmount}
        onConfirm={(value) => setPartialAmount(value)}
      />
    </>
  );
}
