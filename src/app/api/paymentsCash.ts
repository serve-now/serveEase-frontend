import { instance } from '@/lib/axios';

export type RequestCash = {
  amount: number;
};

export async function paymentsCash(orderId: number, body: RequestCash) {
  const { data } = await instance.post(
    `/stores/@me/orders/${orderId}/payments/cash`,
    body,
  );
  return data;
}

export async function paymentsCashFull(orderId: number) {
  const { data } = await instance.post(
    `/stores/@me/orders/${orderId}/payments/cash/full`,
  );
  return data;
}
