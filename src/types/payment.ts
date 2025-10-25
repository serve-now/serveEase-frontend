export type PaymentConfirmRequest = {
  paymentKey: string;
  orderId: string;
  parentOrderId: string;
  amount: number;
};

export type PaymentConfirmResponse = {
  orderId: string;
  method: string;
  cardCompany: string;
  maskedCardNumber: string;
  approvalNumber: string;
  approvedAt: string;
  paidAmount: number;
  remainingAmount: number;
  orderStatus: string;
};
