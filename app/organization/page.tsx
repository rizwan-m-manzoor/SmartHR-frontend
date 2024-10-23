"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getJobs, deleteJob } from "./../../redux/slices/jobSlice";
import { AppDispatch, RootState } from "./../../redux/store";
import { IJob } from "./../../utils/Interface";
import Head from "next/head";
import AppSidebar from "@/components/modern-layout/app-sidebar";

const OrganizationJobs = () => {
  const [currPage, setCurrPage] = useState(1);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!auth.accessToken) {
      router.push("/login");
    } else {
      if (auth.user?.role?.name !== "organization") {
        router.push("/");
      }
    }
  }, [router, dispatch, auth]);

  useEffect(() => {
    if (auth.accessToken)
      dispatch(getJobs({ token: auth.accessToken, page: currPage }));
  }, [auth, currPage, dispatch]);

  return (
    <>
      <Head>
        <title>Resource AI | Job Management</title>
      </Head>
      <AppSidebar>
        {
          <div className="p-7">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border border-gray-300 shadow-xl shrink-0">
                <img
                  src={auth.user?.avatar}
                  alt={auth.user?.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="font-medium text-lg">{auth.user?.username}</h1>
                <p className="text-gray-500 mt-2 text-sm">
                  {auth.user?.province}, {auth.user?.city},{" "}
                  {auth.user?.district}, {auth.user?.postalCode}
                </p>
              </div>
            </div>
            <div className="mt-7">
              <h1 className="font-medium text-lg mb-3">Description</h1>
              <div
                className="text-sm text-gray-600 leading-loose break-words"
                dangerouslySetInnerHTML={{
                  __html: auth.user?.organization?.description || '',
                }}
              />
            </div>
            <div className="mt-7">
              <h1 className="font-medium text-lg mb-3">Address</h1>
              <p>{auth.user?.organization?.address}</p>
            </div>
            <div className="mt-7">
              <h1 className="font-medium text-lg mb-3">Phone Number</h1>
              <p>{auth.user?.organization?.phoneNumber}</p>
            </div>
            <div className="mt-7">
              <h1 className="font-medium text-lg mb-3">
                Estimated Total Employee
              </h1>
              <p>&plusmn; {auth.user?.organization?.totalEmployee} people</p>
            </div>
          </div>
        }
      </AppSidebar>
    </>
  );
};

export default OrganizationJobs;
