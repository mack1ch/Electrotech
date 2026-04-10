'use client';

import { DescriptionReadMoreSection } from '@/components/service/description-read-more-section';

export function ProductDescriptionBlock({ text }: { text: string }) {
  return (
    <DescriptionReadMoreSection
      text={text}
      headingClassName="text-[21px] font-semibold leading-normal text-[#707070]"
      contentClassName="text-base leading-normal text-[#6a7282]"
    />
  );
}
