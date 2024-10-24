"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getReceivedInvitations } from "./../../redux/slices/invitationSlice";
import { AppDispatch, RootState } from "./../../redux/store";
import Head from "next/head";
import Footer from "./../../components/general/Footer";
import Navbar from "./../../components/general/Navbar";
import OrganizationCard from "./../../components/general/OrganizationCard";

const ReceivedInvitation = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const invitation = useSelector((state: RootState) => state.invitation);

  useEffect(() => {
    if (!auth.accessToken) {
      router.push("/login?r=received_invitation");
    } else {
      if (auth.user?.role?.name !== "jobseeker") {
        router.push("/");
      } else {
        dispatch(getReceivedInvitations(`${auth.accessToken}`));
      }
    }
  }, [auth, dispatch, router]);

  return (
    <>
      <Head>
        <title>Resource AI | Received Invitation</title>
      </Head>
      <Navbar />
      <div className="flex flex-col" style={{ minHeight: "70vh" }}>
        <div className="md:py-10 py-6 md:px-16 px-8 flex-grow">
          <h1 className="text-xl font-medium">Received Invitation</h1>
          {invitation.length === 0 ? (
            <div className="mt-6 bg-red-500 text-white py-3 rounded-md text-center">
              There's no received invitation data found.
            </div>
          ) : (
            <div className="mt-6 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-10 gap-8">
              {invitation.map((item) => (
                <OrganizationCard key={item.id} data={item} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReceivedInvitation;
