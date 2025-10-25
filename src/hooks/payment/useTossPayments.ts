'use client';

import {
  loadTossPayments,
  TossPaymentsPayment,
} from '@tosspayments/tosspayments-sdk';
import { useEffect, useRef, useState } from 'react';
import { createOrderName } from '../../lib/paymentUtils';
import { getNextPartOrderId } from '@/lib/paymentPartCounter.ts';
import { toast } from 'sonner';

export interface OrderDataForPayment {
  totalPrice: number;
  orderItems: { menuName: string; quantity: number }[];
  restaurantTableId?: number;
}

export interface PaymentParams {
  parentOrderId: string;
  tableId?: number;
  orderData: OrderDataForPayment;
}

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

export default function useTossPayments(customerKey?: string) {
  const [paymentInstance, setPaymentInstance] =
    useState<TossPaymentsPayment | null>(null);
  const initInProgress = useRef(false);

  useEffect(() => {
    if (!clientKey || !customerKey || paymentInstance || initInProgress.current)
      return;
    initInProgress.current = true;

    loadTossPayments(clientKey)
      .then((tp) => setPaymentInstance(tp.payment({ customerKey })))
      .catch((e) => {
        console.error('토스 SDK 초기화 실패:', e);
        toast.error('결제 모듈 초기화에 실패했습니다.');
      })
      .finally(() => (initInProgress.current = false));
  }, [customerKey, paymentInstance]);

  const ensurePaymentInstance = async () => {
    if (paymentInstance) return paymentInstance;

    if (!clientKey || !customerKey) {
      // 이 시점에도 없으면 그때만 에러
      throw new Error(
        '결제에 필요한 키가 없습니다. 잠시 후 다시 시도하거나 새로고침 해주세요.',
      );
    }

    const tp = await loadTossPayments(clientKey);
    const p = tp.payment({ customerKey });
    setPaymentInstance(p);
    return p;
    // (race condition 최소화를 위해 setState 전에 p를 즉시 반환)
  };

  const requestPayment = async ({
    parentOrderId,
    tableId,
    orderData,
  }: PaymentParams) => {
    try {
      if (!parentOrderId || !orderData) {
        throw new Error('결제 요청에 필요한 주문 정보가 없습니다.');
      }

      const payment = await ensurePaymentInstance(); // ← 여기에서 보장

      const externalOrderId = getNextPartOrderId(parentOrderId);
      const origin =
        typeof window !== 'undefined' ? window.location.origin : '';

      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: orderData.totalPrice },
        orderId: externalOrderId,
        orderName: createOrderName(orderData.orderItems),
        successUrl: `${origin}/pos/payment/success`,
        failUrl: `${origin}/pos/payment/fail?tableId=${tableId}&orderId=${parentOrderId}`,
      });
    } catch (e) {
      console.error('결제 요청 실패:', e);
      toast.error(
        e instanceof Error ? e.message : '결제 요청 중 오류가 발생했습니다.',
      );
    }
  };

  const ready = !!clientKey && !!customerKey;

  return { requestPayment, ready };
}
