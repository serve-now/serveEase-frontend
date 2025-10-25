'use client';

import { useSearchParams } from 'next/navigation';
import FullPaymentComplete from '../_components/FullPaymentComplete';
import PartialPaymentNotice from '../_components/PartialPaymentNotice';
import type { PaymentConfirmResponse } from '@/types/payment';

export default function CashSuccessPage() {
  const params = useSearchParams();

  const orderId = params.get('orderId') ?? '';
  const paidAmount = Number(params.get('amount') ?? '0');
  const remainingAmount = Number(params.get('remaining') ?? '0');
  const approvedAt = params.get('approvedAt') || new Date().toISOString();
  const cashApprovalNumber = params.get('cashApprovalNumber') || '';

  // 결제 결과를 PaymentConfirmResponse 형태로 맞춰서 컴포넌트 재사용
  const payment: PaymentConfirmResponse = {
    orderId,
    method: 'CASH',
    cardCompany: '', // 현금이라 공란
    maskedCardNumber: '', // 현금이라 공란
    approvalNumber: cashApprovalNumber, // 현금 승인번호 있으면 전달
    approvedAt,
    paidAmount,
    remainingAmount,
    orderStatus: remainingAmount === 0 ? 'COMPLETED' : 'PARTIALLY_PAID',
  };

  return payment.orderStatus === 'COMPLETED' ? (
    <div className="flex items-center justify-center">
      <FullPaymentComplete payment={payment} />
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <PartialPaymentNotice payment={payment} />
    </div>
  );
}
