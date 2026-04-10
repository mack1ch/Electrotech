'use client';

import { DescriptionReadMoreSection } from '@/components/service/description-read-more-section';
import { cn } from '@electrotech/ui';

export function SupplierDescriptionSection({ text, className }: { text: string; className?: string }) {
  return (
    <DescriptionReadMoreSection
      text={text}
      className={cn('lg:pb-4', className)}
      headingClassName="text-lg font-semibold leading-normal text-[#707070] lg:text-[21px]"
      contentClassName="text-sm leading-normal text-[#6a7282] lg:text-base"
    />
  );
}
