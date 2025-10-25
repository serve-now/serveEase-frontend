'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, CreditCard, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useConfirmPayment } from '@/hooks/payment/usePayment';
import type { PaymentConfirmResponse } from '@/types/payment';
import PartialPaymentNotice from './_components/PartialPaymentNotice';
import FullPaymentComplete from './_components/FullPaymentComplete';
import {
  mockCompletedPayment,
  mockPartialPayment,
} from '@/lib/mock/paymentMocks';

export default function PaymentSuccessPage() {
  const TEST_MODE = false; // <-- false로 바꾸면 원래 로직 복구됨
  const TEST_PAYMENT = mockPartialPayment; // or mockCompletedPayment
  // const TEST_PAYMENT = mockCompletedPayment; // or mockCompletedPayment

  if (TEST_MODE) {
    return TEST_PAYMENT.orderStatus === 'COMPLETED' ? (
      <FullPaymentComplete payment={TEST_PAYMENT} />
    ) : (
      <PartialPaymentNotice payment={TEST_PAYMENT} />
    );
  }

  const params = useSearchParams();

  const orderId = params.get('orderId');
  const paymentKey = params.get('paymentKey');

  const amtStr = params.get('amount');
  const amount = amtStr ? parseInt(amtStr, 10) : undefined;

  const { mutateAsync, isError } = useConfirmPayment();

  const [paymentLocal, setPaymentLocal] =
    useState<PaymentConfirmResponse | null>(null);

  // 결제 중복 호출 확인용
  const calledRef = useRef(false);

  useEffect(() => {
    const ready = !!(paymentKey && orderId && amount != null);

    // 이미 호출했거나, 필수 파라미터가 없으면 중단
    if (calledRef.current || !ready) return;

    // 결제 중복 방지 설정
    calledRef.current = true;

    (async () => {
      try {
        const res = await mutateAsync({
          paymentKey,
          orderId,
          parentOrderId: orderId.replace(/-part\d+$/, ''),
          amount: amount as number,
        });

        setPaymentLocal(res);
      } catch (err) {
        console.error('토스페이먼츠 결제 승인 실패:', err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentKey, orderId, amount]);

  if (!paymentLocal && !isError) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p>결제 정보를 확인 중입니다…</p>
        </div>
      </div>
    );
  }

  if (isError || !paymentLocal) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-red-600">
        <h2 className="text-xl font-bold mb-2">결제 확인에 실패했습니다.</h2>
        <p>다시 시도해 주세요.</p>
        <Link href="/pos/tables">
          <Button className="mt-4 bg-red-600 hover:bg-red-700">
            테이블 페이지로 돌아가기
          </Button>
        </Link>
      </div>
    );
  }

  const payment = paymentLocal;

  return payment.orderStatus === 'COMPLETED' ? (
    <FullPaymentComplete payment={payment} />
  ) : (
    <PartialPaymentNotice payment={payment} />
  );
}
