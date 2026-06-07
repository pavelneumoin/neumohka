import { NextResponse, type NextRequest } from "next/server";

/**
 * Блокируем прямой доступ к PDF в /library/*.pdf — отдаются только через
 * /api/file/[slug]/[type] с проверкой auth+unlock.
 * PNG-превью остаются открытыми, иначе каталог не покажет картинки.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // /library/{slug}/{file}.pdf → редирект на гейт-API того же урока
  const pdfMatch = pathname.match(/^\/library\/([^/]+)\/([^/]+)\.pdf$/);
  if (pdfMatch) {
    const [, slug, file] = pdfMatch;
    const url = req.nextUrl.clone();
    url.pathname = `/api/file/${slug}/${file}`;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/library/:path*"],
};
