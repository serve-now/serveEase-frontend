'use client';

const getStorageKey = (parentOrderId: string) => `split-count:${parentOrderId}`;

export function getNextPartOrderId(parentOrderId: string) {
  const current = parseInt(
    localStorage.getItem(getStorageKey(parentOrderId)) || '0',
    10,
  );
  const next = current + 1;
  localStorage.setItem(getStorageKey(parentOrderId), String(next));
  return `${parentOrderId}-part${next}`;
}

export function resetPart(parentOrderId: string) {
  localStorage.removeItem(getStorageKey(parentOrderId));
}
