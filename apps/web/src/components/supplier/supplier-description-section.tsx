'use client';

import { DescriptionReadMoreSection } from '@/components/service/description-read-more-section';
import { cn } from '@electrotech/ui';

export function SupplierDescriptionSection({ text, className }: { text: string; className?: string }) {
  return (
    <DescriptionReadMoreSection
      text={text}
      className={cn('lg:pb-4', className)}
      headingClassName="text-lg font-semibold leading-normal text-ink lg:text-[21px]"
      contentClassName="text-sm leading-normal text-[#4a5565] lg:text-base"
    />
  );
}
