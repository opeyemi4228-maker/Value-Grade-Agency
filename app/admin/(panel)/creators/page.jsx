import EnquiryList from "@/components/admin/EnquiryList";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata = { title: "Creator applications" };

export default async function CreatorsPage({ searchParams }) {
  await requireAdmin();
  const params = await searchParams;
  return (
    <EnquiryList
      basePath="/admin/creators"
      params={params}
      lockedIntent="creator"
      title="Creator applications"
      description="Creators who applied to join the VGA network through the website."
    />
  );
}
