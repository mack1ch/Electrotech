'use client';

import { Form, Input } from 'antd';
import { LoaderCircle, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { SuppliersUrlState } from '@/lib/suppliers/suppliers-params';
import { suppliersPath } from '@/lib/suppliers/suppliers-params';
import { useNavigationPending } from '@/lib/ui/use-navigation-pending';

type SuppliersQueryBarProps = {
  state: SuppliersUrlState;
};

/** Строка поиска — как на странице поиска товаров. */
export function SuppliersQueryBar({ state }: SuppliersQueryBarProps) {
  const router = useRouter();
  const [form] = Form.useForm<{ q: string }>();
  const queryValue = Form.useWatch('q', form) ?? '';
  const hasQuery = queryValue.trim().length > 0;
  const { runNavigation, isPending } = useNavigationPending();
  const submitPending = isPending('suppliers-query-submit');

  return (
    <Form
      form={form}
      key={`suppliers-q-${state.q}-${serialize(state)}`}
      initialValues={{ q: state.q }}
      onFinish={(v) => {
        const q = String(v['q'] ?? '').trim();
        runNavigation('suppliers-query-submit', () => {
          router.push(suppliersPath({ ...state, q, page: 1 }));
        });
      }}
      className="space-y-2"
      requiredMark={false}
    >
      <div className="flex min-h-[50px] items-center overflow-hidden rounded-[10px] bg-white px-[25px] py-[13px] shadow-none lg:shadow-sm">
        <Form.Item
          name="q"
          noStyle
          className="!mb-0 min-w-0 flex-1 pr-1 [&_.ant-form-item-control-input]:min-h-0 [&_.ant-input-affix-wrapper]:!border-0 [&_.ant-input-affix-wrapper]:!shadow-none"
        >
          <Input
            variant="borderless"
            size="large"
            placeholder="Название или часть названия"
            className="!px-0 !py-0 !pe-3 !text-[17px] !font-medium !leading-6 !shadow-none [&_input]:placeholder:font-normal [&_input]:placeholder:text-muted"
          />
        </Form.Item>
        <Form.Item noStyle className="!mb-0 ms-3 flex shrink-0 items-center gap-1">
          {hasQuery ? (
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded border-0 bg-transparent p-0 text-ink shadow-none outline-none transition-colors hover:bg-transparent hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 active:bg-transparent"
              aria-label="Очистить поиск поставщиков"
              onClick={() => form.setFieldValue('q', '')}
              disabled={submitPending}
            >
              <X className="size-5" strokeWidth={1.9} aria-hidden />
            </button>
          ) : null}
          <button
            type="submit"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded border-0 bg-transparent p-0 text-ink shadow-none outline-none transition-colors hover:bg-transparent hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 active:bg-transparent disabled:pointer-events-none disabled:opacity-40"
            aria-label="Найти поставщиков"
            disabled={submitPending}
            aria-busy={submitPending}
          >
            {submitPending ? (
              <LoaderCircle className="size-5 animate-spin" strokeWidth={1.9} aria-hidden />
            ) : (
              <Search className="size-6" strokeWidth={1.75} aria-hidden />
            )}
          </button>
        </Form.Item>
      </div>
    </Form>
  );
}

function serialize(s: SuppliersUrlState): string {
  return [s.sort, s.pageSize, s.category, s.warehouse, s.page].join('|');
}
