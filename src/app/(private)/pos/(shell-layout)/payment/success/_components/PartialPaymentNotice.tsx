'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { PaymentConfirmResponse } from '@/types/payment';

interface Props {
  payment: PaymentConfirmResponse;
}

export default function PartialPaymentNotice({ payment }: Props) {
  const [lastTableId, setLastTableId] = useState<string | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  useEffect(() => {
    const storedTableId = localStorage.getItem('lastPaymentTableId');
    const storedOrderId = localStorage.getItem('lastPaymentOrderId');
    setLastTableId(storedTableId);
    setLastOrderId(storedOrderId);
  }, []);

  const checkoutUrl = lastTableId
    ? `/pos/tables/${lastTableId}/checkout?orderId=${lastOrderId}`
    : `/pos/tables`;
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="mb-5">
        <div className="w-13 h-13 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
          <AlertTriangle size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          분할 결제가 완료되었습니다
        </h2>
        <p className="text-sm text-gray-600">
          현재{' '}
          <span className="font-semibold text-amber-600">
            {payment.remainingAmount.toLocaleString()}원
          </span>
          이 남아있습니다.
        </p>
      </div>

      <Card className="w-full max-w-sm mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard size={18} /> 결제 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <Info
            label="결제 금액"
            value={`${payment.paidAmount.toLocaleString()}원`}
          />
          <Info
            label="남은 금액"
            value={`${payment.remainingAmount.toLocaleString()}원`}
          />
          <Info label="결제 수단" value={payment.method} />
          <Info label="승인번호" value={payment.approvalNumber} />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 w-full max-w-sm">
        <Button variant="default" asChild>
          <Link href={checkoutUrl}>추가 결제 진행하기</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={'/pos/tables'}>테이블 페이지로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
