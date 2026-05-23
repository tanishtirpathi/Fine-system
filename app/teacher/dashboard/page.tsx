import { getMe, allStudents } from "@/lib/server/api";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const user = await getMe();
  const students = await allStudents();

  return <DashboardClient user={user} students={students ?? []} />;
}

