"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { User, UserPagination } from "./types";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<UserPagination>();

  const getUsersData = async (page = 1) => {
    const res = await (await fetch(`https://reqres.in/api/users?page=${page}`)).json();

    if (!res) return console.log('Error fetching data');

    setUsers(res.data);
    setPagination({
      page: res.page,
      total_pages: res.total_pages,
    });
  };

  useEffect(() => {
    getUsersData();
  }, []);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>
        This is a test app to try out the new features of Next.js 13.
      </p>
      {users && users.map((user) => (
        // create a tailwind user card for each user
        <div key={user.first_name} className="flex flex-col items-center justify-center rounded-lg shadow-lg bg-gray-100 p-4 m-4">
          <Image width={300} height={300} className="w-32 h-32 rounded-full" src={user.avatar} alt={user.first_name} />
          <div className="text-center">
            <h2 className="text-lg font-semibold">{user.first_name} {user.last_name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      ))}
    </main>
  )
}
