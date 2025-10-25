'use client';

import { Check, CreditCard, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { PaymentConfirmResponse } from '@/types/payment';

interface Props {
  payment: PaymentConfirmResponse;
}

export default function FullPaymentComplete({ payment }: Props) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center mb-5">
        <div className="w-13 h-13 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
          <Check size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          결제가 완료되었습니다
        </h2>
        <p className="text-sm text-gray-600">
          고객님의 결제가 성공적으로 처리되었습니다.
        </p>
      </div>

      <Card className="w-full max-w-sm mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText size={18} /> 결제 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <InfoRow
            label="결제 금액"
            value={`${payment.paidAmount.toLocaleString()}원`}
          />
          <PaymentMethodRow
            method={payment.method}
            company={payment.cardCompany}
            masked={payment.maskedCardNumber}
          />
          <InfoRow label="결제 시간" value={payment.approvedAt} />
          <InfoRow label="승인번호" value={payment.approvalNumber} mono />
        </CardContent>
      </Card>

      <Button className="w-full max-w-sm">
        <Link href={'/pos/tables'}>테이블 페이지로 돌아가기</Link>
      </Button>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className={`text-sm ${mono ? 'font-mono' : 'font-medium'}`}>
        {value}
      </span>
    </div>
  );
}

function PaymentMethodRow({ method, company, masked }: any) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-600 flex items-center gap-2 text-sm">
        <CreditCard size={14} /> 결제 방법
      </span>
      <div className="text-right">
        <div className="font-medium text-sm">{method}</div>
        {company && masked && (
          <div className="text-xs text-gray-500">
            {company} ({masked})
          </div>
        )}
      </div>
    </div>
  );
}
