'use client';

import { Form, Input } from 'antd';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { SearchUrlState } from '@/lib/search/search-params';
import { searchPath } from '@/lib/search/search-params';

export function SearchQueryBar({ state }: { state: SearchUrlState }) {
  const router = useRouter();

  return (
    <Form
      key={`q-${state.q}-${serialize(state)}`}
      initialValues={{ q: state.q }}
      onFinish={(v) => {
        const q = String(v['q'] ?? '').trim();
        router.push(searchPath({ ...state, q, page: 1 }));
      }}
      className="space-y-2"
      requiredMark={false}
    >
      <div className="flex min-h-[50px] items-center overflow-hidden rounded-[10px] bg-white px-[25px] py-[13px] shadow-none lg:shadow-sm">
        <Form.Item
          name="q"
          noStyle
          className="!mb-0 min-w-0 flex-1 [&_.ant-form-item-control-input]:min-h-0 [&_.ant-input-affix-wrapper]:!border-0 [&_.ant-input-affix-wrapper]:!shadow-none"
        >
          <Input
            variant="borderless"
            size="large"
            placeholder="Поиск"
            className="!px-0 !py-0 !text-base !font-semibold !leading-6 !shadow-none [&_input]:placeholder:font-normal [&_input]:placeholder:text-muted"
          />
        </Form.Item>
        <Form.Item noStyle className="!mb-0 ms-2 flex shrink-0 items-center">
          <button
            type="submit"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded border-0 bg-transparent p-0 text-ink shadow-none outline-none transition-colors hover:bg-transparent hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 active:bg-transparent disabled:pointer-events-none disabled:opacity-40"
            aria-label="Искать"
          >
            <Search className="size-6" strokeWidth={1.75} aria-hidden />
          </button>
        </Form.Item>
      </div>
    </Form>
  );
}

function serialize(s: SearchUrlState): string {
  return [
    s.sort,
    s.pageSize,
    s.category,
    s.priceMin,
    s.priceMax,
    s.minStock,
    s.updatedFrom,
    s.availability,
    s.excludeOnRequest ? '1' : '0',
  ].join('|');
}
