import { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IJob, IInvitation } from "./../../utils/Interface";
import { toPKRCurrency } from "./../../utils/numberFormatter";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface IProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  invitationData?: IInvitation;
  jobDetail?: IJob;
}

const InvitationDetailModal = ({
  openModal,
  setOpenModal,
  invitationData,
  jobDetail,
}: IProps) => {
  const modalRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const auth = useSelector((state: RootState) => state.auth);

  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (
        openModal &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        setOpenModal(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);
    return () =>
      document.removeEventListener("mousedown", checkIfClickedOutside);
  }, [openModal]);

  useEffect(() => {
    setProvince(
      jobDetail
        ? auth.user?.province || ""
        : invitationData?.job.organization?.user?.province || ""
    );
  }, [invitationData?.job.organization?.user?.province, jobDetail]);

  useEffect(() => {
    setCity(
      jobDetail
        ? auth.user?.city || ""
        : invitationData?.job.organization?.user?.city || ""
    );
  }, [invitationData?.job.organization?.user?.city, jobDetail]);

  useEffect(() => {
    setDistrict(
      jobDetail
        ? auth.user?.district || ""
        : invitationData?.job.organization?.user?.district || ""
    );
  }, [invitationData?.job.organization?.user?.district, jobDetail]);

  return (
    <div
      className={`${
        openModal
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } modal-background`}
    >
      <div
        ref={modalRef}
        className={`${
          openModal ? "translate-y-0" : "-translate-y-12"
        } modal-box max-w-[600px] h-[550px] overflow-auto hide-scrollbar bg-card`}
      >
        <div className="modal-box-header">
          <h1 className="font-medium text-lg">Job Detail</h1>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            className="cursor-pointer"
          />
        </div>
        <div className="p-7">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full border border-gray-300 shrink-0">
              <img
                src={
                  jobDetail
                    ? auth.user?.avatar
                    : invitationData?.job.organization?.user?.avatar
                }
                alt={
                  jobDetail
                    ? auth.user?.avatar
                    : invitationData?.job.organization?.user?.username
                }
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-[#504ED7] text-lg">
                {jobDetail ? jobDetail.position : invitationData?.job.position}
              </h1>
              <p className="text-xs mt-2">
                {jobDetail
                  ? auth.user?.username
                  : invitationData?.job.organization?.user?.username}
              </p>
            </div>
          </div>
          <div className="mt-5">
            <p className="font-medium mb-4">Job Overview</p>
            <div
              className="break-words text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: `${
                  jobDetail ? jobDetail.overview : invitationData?.job.overview
                }`,
              }}
            />
            <p className="font-medium mt-7 mb-4">Skills and Expertise</p>
            <div className="flex items-center gap-3 mb-7">
              {jobDetail ? (
                <>
                  {jobDetail.skills.map((item) => (
                    <p
                      key={item}
                      className="bg-gray-200 text-gray-600 text-xs px-3 py-2 rounded-full"
                    >
                      {item}
                    </p>
                  ))}
                </>
              ) : (
                <>
                  {invitationData?.job.skills.map((item) => (
                    <p
                      key={item}
                      className="bg-gray-200 text-gray-600 text-xs px-3 py-2 rounded-full"
                    >
                      {item}
                    </p>
                  ))}
                </>
              )}
            </div>
            <p className="font-medium mb-4">Requirements</p>
            <div
              className="break-words mb-7 list-disc ml-5"
              dangerouslySetInnerHTML={{
                __html: `${
                  jobDetail
                    ? jobDetail.requirements
                    : invitationData?.job.requirements
                }`,
              }}
            />
            <p className="mt-7 font-medium mb-4">Salary</p>
            <div className="flex items-center mb-7">
              <p className="font-semibold text-lg">
                {toPKRCurrency(
                  jobDetail
                    ? (jobDetail.salary as number)
                    : (invitationData?.job.salary as number)
                )}
              </p>
              <p className="text-gray-500 text-xs">/month</p>
            </div>
            <p className="font-medium mb-4">Company Overview</p>
            <div
              className="text-sm leading-relaxed mb-3"
              dangerouslySetInnerHTML={{
                __html: `${
                  jobDetail
                    ? auth.user?.organization?.description
                    : invitationData?.job.organization?.description
                }`,
              }}
            />
            <p className="font-medium mb-4 mt-7">Company Location</p>
            <p className="mb-3 text-sm">
              {province}, {city}, {district}
            </p>
            <p className="mb-7 text-sm">
              {jobDetail
                ? auth.user?.organization?.address
                : invitationData?.job.organization?.address}
              ,{" "}
              {jobDetail
                ? auth.user?.postalCode
                : invitationData?.job.organization?.user?.postalCode}
            </p>
            <p className="font-medium mb-4">Estimated Company Total Employee</p>
            <p>
              {jobDetail
                ? auth.user?.organization?.totalEmployee
                : invitationData?.job.organization?.totalEmployee}{" "}
              people
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationDetailModal;
