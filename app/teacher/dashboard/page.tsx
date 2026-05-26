import { redirect } from "next/navigation";
import { getMe, allStudents } from "@/lib/server/api";
import DashboardClient from "./dashboard-client";
export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  
    const user = await getMe();

    if (!user) {
      console.log("error: no user");
      redirect("/login");
    }

    const students = await allStudents();

    return (
      <DashboardClient
        user={user}
        students={students ?? []}
      />
    );

}