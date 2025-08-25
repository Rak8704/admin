import { db } from "@/lib/db";
import { AdminTable } from "./data-table";
import { auth } from "@/auth";

async function getAdmins() {
  const data = await db.admin.findMany();
  return data;
}

export default async function SubAdminsPage() {
  const data = await getAdmins();
  const session = await auth();
  const userRole = session?.user?.role;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sub-Admins</h1>
        {/* Create Sub-Admin functionality will be handled in the data table component */}
      </div>
      <AdminTable data={data} userRole={userRole} />
    </div>
  );
}