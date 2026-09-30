import { createClient } from "@/lib/supabase/server";
import UserRoleManager from "@/components/UserRoleManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("id, email, role").order("email");

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-4">Users &amp; Roles</h1>
      <UserRoleManager users={data ?? []} />
    </div>
  );
}