'use client';

import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '@/components/Loader/Loader';
import { User, UserPagination } from './types';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<UserPagination>();
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef(null);

  const getInitialUsers = async () => {
    setLoading(true);
    await new Promise((r) => { setTimeout(r, 3000); });

    try {
      const res = await (await fetch('https://reqres.in/api/users?page=1')).json();
      setUsers(res.data);
      setPagination({
        page: res.page,
        total_pages: res.total_pages,
      });
    } catch (error) {
      // Disabling EsLint rule for console.error in a real app this would need to be implemented
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getMoreUsers = useCallback(async () => {
    const nextPage = pagination && pagination.page + 1;
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
        // Disabling EsLint rule for console.error in a real app this would need to be implemented
        // eslint-disable-next-line no-console
        console.error(error);
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

  if (!loading && users.length) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-12 md:p-24">
        <h1 className="text-2xl md:text-4xl font-bold mb-8">Users</h1>
        <p className="text-gray-600 mb-8">Scroll down to load more users, click on a user to see more details.</p>
        <div className="container mx-auto p-4">
          <ul className="divide-y">
            {users && users.map((user) => (
              <Link key={user.id} href={`/users/${user.id}`}>
                <li className="flex items-center py-3">
                  <Image
                    width={1000}
                    height={1000}
                    src={user.avatar}
                    alt={`${user.last_name} Avatar`}
                    className="w-20 h-20 md:w-40 md:h-40 rounded-full border border-gray-300"
                  />
                  <span className="ml-4 md:ml-8 text-lg md:text-xl">
                    {user.first_name}
                    {' '}
                    {user.last_name}
                  </span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
        {users && <div ref={observerTarget} />}
        {pagination?.page === pagination?.total_pages
          && <p className="text-gray-600">No more users to load</p>}
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Loader />
    </main>
  );
}
