export const mockCompletedPayment = {
  paymentOrderId: 'ABCD-1234-part1',
  orderId: 'ABCD-1234',
  method: 'CARD',
  cardCompany: 'KAKAOBANK',
  maskedCardNumber: '1234-****-****-5678',
  approvalNumber: 'A12345',
  approvedAt: '2025-01-15T14:12:30+09:00',
  paidAmount: 10000,
  remainingAmount: 0,
  orderStatus: 'COMPLETED',
};

export const mockPartialPayment = {
  paymentOrderId: 'ABCD-1234-part1',
  orderId: 'ABCD-1234',
  method: 'CARD',
  cardCompany: 'KAKAOBANK',
  maskedCardNumber: '1234-****-****-5678',
  approvalNumber: 'A12345',
  approvedAt: '2025-01-15T14:12:30+09:00',
  paidAmount: 7000,
  remainingAmount: 3000,
  orderStatus: 'PARTIALLY_PAID',
};
