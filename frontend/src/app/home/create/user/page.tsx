
"use client";
import { branchFields } from '@/app/constant/formFeilds';
import DynamicForm from '@/components/DynamicForm';
import Modal from '@/components/modal';
import { UserTable } from '@/components/UserTable'
import { withAuth } from '@/hoc/withAuth';
import { useGetUserQuery } from '@/store/services/api/hospitalApi';
import React from 'react'

function CreateUser() {
  const { data: UserList, isLoading, error } = useGetUserQuery();
  if (isLoading) return <p className="text-red-500 text-center py-10">Loading...</p>;

  const {admin,receptionist} = UserList as any;
  return (
    <>
    <UserTable admins={admin} receptionists={receptionist} />
      </>
  )
}

export default withAuth(CreateUser);