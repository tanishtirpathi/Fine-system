import { getMe , allStudents} from "@/lib/server/api";

export default async function DashboardPage() {
  const user = await getMe();
  if (!user) {
    return <div>Loading...</div>;
  }

  const students = await allStudents();
  if (!students) {
    return <div>Loading students...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">User Details</h1>
        <pre className="bg-gray-200 p-4 rounded">
          {JSON.stringify(user, null, 2)}
        </pre>
        <h2 className="text-xl font-bold mt-6 mb-4">All Students</h2>
        <pre className="bg-gray-200 p-4 rounded">
          {JSON.stringify(students, null, 2)}
        </pre>
      </div>
    </div>
  );
};

