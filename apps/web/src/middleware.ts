import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/** Единственная выдача товаров — `/search`; старый `/catalog` не используется. */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/catalog' || pathname.startsWith('/catalog/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/search';
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/catalog', '/catalog/:path*'],
};
