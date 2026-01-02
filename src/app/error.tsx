'use client';

import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center ">
      <AlertTriangle
        className="w-14 h-14 text-red-500 mb-6"
        aria-label="경고"
      />
      <h2 className="text-2xl font-bold mb-4">문제가 발생했습니다.</h2>
      <p className="text-gray-600 mb-6">
        서비스 이용에 불편을 드려 죄송합니다. <br /> 잠시 후 다시 시도해 주세요.
      </p>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
        onClick={reset}
      >
        새로고침
      </button>
    </div>
  );
}
