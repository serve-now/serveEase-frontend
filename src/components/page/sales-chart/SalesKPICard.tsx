import { SalesKPITitle } from '@/types/sales';

interface Props {
  title: SalesKPITitle;
  value: number;
}

export default function SalesKPICard({ title, value }: Props) {
  return (
    <div className="flex flex-col gap-2 p-5 border rounded-md bg-white">
      <p className="text-gray-600">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold">
          {Math.floor(value).toLocaleString()}
        </p>
        <span className="text-gray-500">원</span>
      </div>
    </div>
  );
}

// 밍