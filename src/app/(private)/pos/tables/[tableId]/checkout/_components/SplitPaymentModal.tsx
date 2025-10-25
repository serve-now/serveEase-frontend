'use client';

import { useState } from 'react';

interface SplitPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onConfirm: (amount: number) => void;
  remainingAmount: number;
}

export default function SplitPaymentModal({
  isOpen,
  onClose,
  totalAmount,
  onConfirm,
  remainingAmount,
}: SplitPaymentModalProps) {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleKeypadClick = (value: string) => {
    if (value === '←') {
      setAmount((prev) => prev.slice(0, -1));
    } else {
      setAmount((prev) => prev + value);
    }
  };

  const formatAmount = (num: string) => {
    if (!num) return '0';
    return parseInt(num, 10).toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-lg font-bold mb-6">분할 결제</h2>

        <p className="text-gray-500 text-sm mb-2">
          남은 결제금액{' '}
          <span className="font-semibold text-[#3B82F6]">
            {remainingAmount.toLocaleString()}원
          </span>{' '}
          중
        </p>

        <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 mb-6">
          <input
            type="text"
            value={formatAmount(amount)}
            readOnly
            className="text-2xl font-semibold flex-1 outline-none bg-transparent text-right"
          />
          <span className="ml-2 text-lg font-medium text-gray-600">원</span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '←'].map(
            (key) => (
              <button
                key={key}
                onClick={() => handleKeypadClick(key)}
                className="text-2xl font-semibold py-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                {key}
              </button>
            ),
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={() => {
              const finalAmount = parseInt(amount || '0', 10);
              if (finalAmount > 0 && finalAmount <= remainingAmount) {
                // ✅ 검증 기준 변경
                onConfirm(finalAmount);
                onClose();
              } else {
                alert('남은 금액 이하로 입력해주세요.');
              }
            }}
            className="px-5 py-2 rounded-md bg-[#3B82F6] text-white font-semibold hover:bg-blue-600"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
