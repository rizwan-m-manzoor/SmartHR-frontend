"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "./../../redux/store";
import Head from "next/head";
import Link from "next/link";
import Footer from "./../../components/general/Footer";
import Navbar from "./../../components/general/Navbar";

const Register = () => {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (auth.accessToken) {
      router.push("/");
    }
  }, [auth, router]);

  return (
    <>
      <Head>
        <title>Resource AI | Sign Up</title>
      </Head>
      <Navbar />
      <div className="flex flex-col" style={{ minHeight: "70vh" }}>
        <div className="bg-[#FAFAFA] px-10 py-14 flex-grow">
          <div className="w-full max-w-[1000px] m-auto text-center">
            <h1 className="font-medium mb-3 text-lg">
              We're glad you're here!
            </h1>
            <p className="text-sm mb-10">
              First of all, what do you want to do?
            </p>
            <div className="flex items-center gap-8 md:flex-row flex-col">
              <div className="bg-background flex-1 py-16 px-5 rounded-md shadow-md border border-gray-200">
                <h1 className="font-medium text-2xl">I am looking for work</h1>
                <p className="text-sm mt-5 mb-10">
                  Create a <strong>jobseeker</strong> account.
                </p>
                <Link
                  href="/register/jobseeker"
                  className="bg-[#504ED7] hover:bg-[#2825C2] transition-[background] px-5 py-3 rounded-sm text-sm text-white"
                >
                  START LOOKING FOR JOBS
                </Link>
              </div>
              <strong>OR</strong>
              <div className="bg-background flex-1 py-16 px-5 rounded-md shadow-md border border-gray-200">
                <h1 className="font-medium text-2xl">I am looking to hire</h1>
                <p className="text-sm mt-5 mb-10">
                  Create an <strong>organization</strong> account.
                </p>
                <Link
                  href="/register/organization"
                  className="bg-green-600 hover:bg-green-700 transition-[background] px-5 py-3 rounded-sm text-sm text-white"
                >
                  START LOOKING FOR CANDIDATE
                </Link>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-10">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500">
                Sign in
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
