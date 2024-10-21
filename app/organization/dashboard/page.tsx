"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getJobs, deleteJob } from "../../../redux/slices/jobSlice";
import { AppDispatch, RootState } from "../../../redux/store";
import Head from "next/head";
import Footer from "../../../components/general/Footer";
import Navbar from "../../../components/general/Navbar";
import { OverViewPageView } from "@/app/dashboard-sections/overview/view";

const OrganizationJobs = () => {
  const [currPage, setCurrPage] = useState(1);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!auth.accessToken) {
      router.push("/login?r=organization/dashboard");
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
        <title>Organization Dashboard : Overview</title>
      </Head>
      {/* <Navbar /> */}
      <OverViewPageView />
      {/* <Footer /> */}
    </>
  );
};

export default OrganizationJobs;
