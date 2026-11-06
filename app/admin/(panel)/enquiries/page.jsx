import EnquiryList from "@/components/admin/EnquiryList";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata = { title: "Enquiries" };

export default async function EnquiriesPage({ searchParams }) {
  await requireAdmin();
  const params = await searchParams;
  return (
    <EnquiryList
      basePath="/admin/enquiries"
      params={params}
      title="Enquiries"
      description="Proposal requests, strategy calls, creator applications and general enquiries from the contact form."
    />
  );
}
