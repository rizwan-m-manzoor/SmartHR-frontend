"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getJobs, deleteJob } from "../../../redux/slices/jobSlice";
import { AppDispatch, RootState } from "../../../redux/store";

const OrganizationJobs = () => {
  const [currPage, setCurrPage] = useState(1);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!auth.accessToken) {
      router.push("/login");
    } else if (auth.user?.role?.name === "organization") {
      router.push("/organization/dashboard/overview");
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

  return <></>;
};

export default OrganizationJobs;
