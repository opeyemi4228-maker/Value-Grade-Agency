import { NextResponse } from "next/server";
import { canSeeData, getUser } from "@/lib/auth/session";
import { invoicePdf } from "@/lib/grade/client";
import { canDownloadInvoice } from "@/lib/portal";

// Streams an invoice / receipt PDF from Grade after checking it belongs to the signed-in user.
export async function GET(_request, { params }) {
  const user = await getUser();
  if (!user || !canSeeData(user)) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { id } = await params;
  if (!/^[\w-]{1,80}$/.test(id) || !(await canDownloadInvoice(user, id))) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  try {
    const res = await invoicePdf(id);
    return new Response(res.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="vga-${id}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("[portal] invoice", err);
    return NextResponse.json({ error: "Invoice unavailable." }, { status: 502 });
  }
}
