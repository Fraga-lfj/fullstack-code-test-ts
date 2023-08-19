"use client"

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { User, UserPagination } from "./types";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<UserPagination>();
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef(null);

  const getInitialUsers = async () => {
    setLoading(true);

    try {
      const res = await (await fetch('https://reqres.in/api/users?page=1')).json();
      setUsers(res.data);
      setPagination({
        page: res.page,
        total_pages: res.total_pages,
      });
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const getMoreUsers = useCallback(async () => {
    const nextPage = pagination && pagination?.page + 1;
    if (!loading && nextPage && nextPage <= pagination?.total_pages) {
      setLoading(true);
  
      try {
        const res = await (await fetch(`https://reqres.in/api/users?page=${nextPage}`)).json();
        setUsers([
          ...users,
          ...res.data,
        ]);
        setPagination({
          page: res.page,
          total_pages: res.total_pages,
        });
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    }
  }, [loading, pagination, users]);

  useEffect(() => {
    let observerRefValue: Element | null = null;
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        getMoreUsers();
      }
    };

    const observer = new IntersectionObserver(observerCallback, { threshold: 1 });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
      observerRefValue = observerTarget.current;
    }

    return () => {
      if (observerRefValue) {
        observer.unobserve(observerRefValue);
      }
    };
  }, [getMoreUsers, observerTarget]);

  useEffect(() => {
    getInitialUsers();
  }, []);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>
        This is a test app to try out the new features of Next.js 13.
      </p>
      {users && users.map((user) => (
        // create a tailwind user card for each user
        <div key={user.id} className="flex flex-col items-center justify-center rounded-lg shadow-lg bg-gray-100 p-4 m-4">
          <Image width={300} height={300} className="w-32 h-32 rounded-full" src={user.avatar} alt={user.first_name} />
          <div className="text-center">
            <h2 className="text-lg font-semibold">{user.first_name} {user.last_name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      ))}
      <div ref={observerTarget}></div>
    </main>
  )
}
