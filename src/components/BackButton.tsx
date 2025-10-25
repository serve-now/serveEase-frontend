'use client';
import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { usePathname, useRouter } from 'next/navigation';

interface BackButtonProps {
  buttonStyle?: string;
  iconStyle?: string;
  targetPath?: string;
}

export default function BackButton({
  buttonStyle,
  iconStyle,
  targetPath,
}: BackButtonProps) {
  const router = useRouter();
  const currentPath = usePathname(); // /pos/tables

  const handleBackClick = () => {
    if (targetPath) {
      router.push(targetPath);
      return;
    }

    if (currentPath === '/pos') {
      router.push('/');
      return;
    }

    const pathSegments = currentPath.split('/'); // ['', 'pos', 'tables']
    const parentSegments = pathSegments.slice(0, -1); // ['', 'pos']
    const parentPath = parentSegments.join('/'); // /pos

    if (currentPath.includes('/checkout')) {
      router.back();
      return;
    }

    if (pathSegments.includes('reports')) {
      router.push('/pos');
      return;
    }

    if (pathSegments.includes('success')) {
      router.push('/pos/tables');
      return;
    }

    router.push(parentPath);
  };

  return (
    <Button
      type="button"
      variant={'ghost'}
      className={`${buttonStyle} hover:bg-gray-300`}
      onClick={handleBackClick}
      aria-label="뒤로가기"
    >
      <ChevronLeft className={iconStyle} aria-hidden />
    </Button>
  );
}
