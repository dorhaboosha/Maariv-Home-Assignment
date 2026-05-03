import { NextRequest, NextResponse } from "next/server";
import { TAG_REDIRECTS } from "./config/redirects";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tagMatch = pathname.match(/^\/tags\/(\d+)$/);

  if (tagMatch) {
    const tagId = tagMatch[1];
    const target = TAG_REDIRECTS[tagId];
    if (target) {
      return NextResponse.redirect(target);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/tags/:id*",
};
