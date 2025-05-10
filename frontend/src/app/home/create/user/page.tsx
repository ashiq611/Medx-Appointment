
"use client";

import { UserTable } from '@/components/UserTable'
import { withAuth } from '@/hoc/withAuth';
import { useGetUserQuery } from '@/store/services/api/hospitalApi';
import React from 'react'

function CreateUser() {
  const { data: UserList, isLoading } = useGetUserQuery();
  if (isLoading) return <p className="text-red-500 text-center py-10">Loading...</p>;

  const {admin,receptionist} = UserList as any;
  return (
    <>
    <UserTable admins={admin} receptionists={receptionist} />
      </>
  )
}

export default withAuth(CreateUser);