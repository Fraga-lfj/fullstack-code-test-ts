import { User } from "@/app/types";
import Image from "next/image";

async function getUser(userId: string) {
  const req = await fetch(`https://reqres.in/api/users/${userId}`);
 
  if (!req.ok) {
    throw new Error('Failed to fetch data')
  }
 
  const res = await req.json();
  return res.data;
}

export default async function Page({ params }: { params: { id: string } }) {
  const user: User = await getUser(params.id);

  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24">
      <div className="flex justify-center">
        <Image width={1000} height={1000} src={user.avatar} alt={`${user.last_name} Avatar`} className="w-40 h-40 rounded-full border border-gray-300" />
      </div>

      <div className="text-center mt-4 md:mt-8">
        <h1 className="text-2xl md:text-4xl font-bold">{user.first_name} {user.last_name}</h1>
      </div>

      <ul className="mt-6 md:mt-12 space-y-2 pl-4">
        <li>
          <strong>ID:</strong> <span>{user.id}</span>
        </li>
        <li>
          <strong>Email:</strong> <span>{user.email}</span>
        </li>
      </ul>
    </main>
  )
}