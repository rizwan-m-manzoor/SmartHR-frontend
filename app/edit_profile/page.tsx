"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AiOutlineClose } from "react-icons/ai";
import { getDataAPI } from "./../../utils/fetchData";
import { editProfile } from "./../../redux/slices/authSlice";
import {
  FormSubmit,
  IJobseeker,
  InputChange,
  IProvinceData,
} from "./../../utils/Interface";
import { AppDispatch, RootState } from "./../../redux/store";
import Head from "next/head";
import Footer from "./../../components/general/Footer";
import Navbar from "./../../components/general/Navbar";
import CVModal from "./../../components/modal/CVModal";
import Loader from "./../../components/general/Loader";

const EditProfile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    dob: "",
    cv: "",
    province: "",
    city: "",
    district: "",
    postalCode: 0,
    avatar: "",
    about: "",
  });
  const [jobseeker, setJobseeker] = useState<Partial<IJobseeker>>({});
  const [skills, setSkills] = useState<string[]>([]);
  const [tempAvatar, setTempAvatar] = useState<File[]>([]);
  const [tempCv, setTempCv] = useState<File[]>([]);

  const [provinceData, setProvinceData] = useState<IProvinceData[]>([]);
  const [cityData, setCityData] = useState<string[]>([]);

  const [openCVModal, setOpenCVModal] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const alert = useSelector((state: RootState) => state.alert);

  const handleChangeSkills = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," && (e.target as HTMLInputElement).value !== ",") {
      const val = (e.target as HTMLInputElement).value;
      if (skills.includes(val.substring(0, val.length - 1)))
        (e.target as HTMLInputElement).value = "";
      else {
        setSkills([...skills, val.substring(0, val.length - 1)]);
        (e.target as HTMLInputElement).value = "";
      }
    }
  };

  const handleRemoveSkill = (idx: number) => {
    const skillCopy = [...skills];
    skillCopy.splice(idx, 1);
    setSkills(skillCopy);
  };

  const handleChange = (e: InputChange) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleChangeImage = (e: InputChange) => {
    const target = e.target as HTMLInputElement;
    const files = [...Object.values(target.files!)];
    setTempAvatar([...files]);
  };

  const handleChangeCv = (e: InputChange) => {
    const target = e.target as HTMLInputElement;
    const files = [...Object.values(target.files!)];
    setTempCv([...files]);
  };

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault();

    if (!userData.username) {
      return dispatch({
        type: "alert/alert",
        payload: { error: "Please provide username." },
      });
    }

    if (new Date(userData.dob).toISOString() > new Date().toISOString()) {
      return dispatch({
        type: "alert/alert",
        payload: { error: "Date of birth can't be greater than current date." },
      });
    }

    dispatch(
      editProfile({
        ...userData,
        skills,
        tempAvatar,
        tempCv,
        token: `${auth.accessToken}`,
        userId: auth.user?.id || "",
      })
    );
  };

  useEffect(() => {
    if (!auth.accessToken) {
      router.push("/login?r=edit_profile");
    } else {
      if (auth.user?.role?.name !== "jobseeker") {
        router.push("/");
      }
    }
  }, [router, auth]);

  useEffect(() => {
    const fetchJobseeker = async () => {
      try {
        const res = await getDataAPI(
          `job-seekers/${auth.user?.job_seeker?.id}?populate=skills`,
          `${auth.accessToken}`
        );
        const { skills, ...remainingData } = res.data?.data?.attributes;
        setJobseeker({
          skills: skills.data?.map(
            (item: any) => item.attributes.jobSeekerSkill
          ),
          ...remainingData,
        } as Partial<IJobseeker>);
      } catch (err: any) {
        dispatch({
          type: "alert/alert",
          payload: { error: err.response.error.message },
        });
      }
    };

    if (auth.accessToken) {
      fetchJobseeker();
    }
  }, [auth, dispatch]);

  useEffect(() => {
    if (auth.accessToken) {
      setUserData({
        username: auth.user?.username ?? "",
        email: auth.user?.email ?? "",
        province: auth.user?.province ?? "",
        avatar: auth.user?.avatar ?? "",
        city: auth.user?.city ?? "",
        district: auth.user?.district ?? "",
        cv: jobseeker.cv || "",
        postalCode: auth.user?.postalCode || 0,
        dob: jobseeker.dob ? jobseeker.dob.slice(0, 10) : "",
        about: jobseeker.about || "",
      });
      setSkills((jobseeker.skills as string[]) ?? []);
    }
  }, [auth, jobseeker]);

  useEffect(() => {
    const getProvinceData = () => {
      fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: "Pakistan",
        }),
      })
        .then((res) => res.json())
        .then((res) => setProvinceData(res.data.states));
    };

    getProvinceData();
  }, []);

  useEffect(() => {
    const getCityData = () => {
      fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: "Pakistan",
          state: userData.province,
        }),
      })
        .then((res) => res.json())
        .then((res) => setCityData(res.data));
    };

    if (userData.province) getCityData();

    return () => setCityData([]);
  }, [userData.province]);

  return (
    <>
      <Head>
        <title>Resource AI | My Profile</title>
      </Head>
      <Navbar />
      <div className="md:py-14 py-7 md:px-16 px-8 bg-neutral-100">
        <h1 className="text-3xl text-center mb-9 font-medium">
          <span className="text-[#504ED7]">Edit</span> Profile
        </h1>
        <div className="w-full max-w-[700px] bg-background m-auto shadow-lg border border-gray-200 rounded-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="avatar" className="text-sm">
                Avatar
              </label>
              <div className="flex gap-4 mt-3">
                <div className="w-20 h-20 bg-gray-200 rounded-full shrink-0 shadow-xl border border-gray-300">
                  <img
                    src={
                      tempAvatar.length > 0
                        ? URL.createObjectURL(tempAvatar[0])
                        : userData.avatar
                    }
                    alt={auth.user?.username}
                    className="w-full h-full rounded-full"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="avatar"
                  onChange={handleChangeImage}
                  className="bg-background w-full outline-0 border border-gray-300 text-sm h-10 rounded-md px-2"
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="name" className="text-sm">
                Name
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={userData.username}
                onChange={handleChange}
                className="bg-background outline-0 border border-gray-300 rounded-md h-10 text-sm px-2 w-full mt-3"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                readOnly
                className="bg-background outline-0 border border-gray-300 rounded-md h-10 text-sm px-2 w-full mt-3 bg-gray-100"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="dob" className="text-sm">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={userData.dob}
                onChange={handleChange}
                className="bg-background outline-0 border border-gray-300 rounded-md h-10 text-sm px-2 w-full mt-3"
              />
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <label htmlFor="cv" className="text-sm">
                  CV (PDF Format)
                </label>
                {(tempCv.length > 0 || userData.cv) && (
                  <button
                    type="button"
                    onClick={() => setOpenCVModal(true)}
                    className="bg-red-500 hover:bg-red-600 transition[background] text-white px-2 text-xs py-1 rounded-md"
                  >
                    View CV
                  </button>
                )}
              </div>
              <input
                type="file"
                accept=".pdf"
                id="cv"
                name="cv"
                onChange={handleChangeCv}
                className="bg-background outline-0 border border-gray-300 rounded-md h-10 text-sm px-2 w-full mt-3"
              />
            </div>
            <div className="mb-6 flex md:flex-row flex-col md:items-center md:gap-5 gap-6">
              <div className="flex-1">
                <label htmlFor="province" className="text-sm">
                  Province
                </label>
                <select
                  name="province"
                  id="province"
                  value={userData.province}
                  onChange={handleChange}
                  className="bg-background w-full outline-0 bg-transparent border border-gray-300 rounded-md h-10 px-2 mt-3 text-sm"
                >
                  <option value="">- Select Province -</option>
                  {provinceData.map((item) => (
                    <option key={item.state_code} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="city" className="text-sm">
                  City
                </label>
                <select
                  name="city"
                  id="city"
                  value={userData.city}
                  onChange={handleChange}
                  className="bg-background w-full outline-0 bg-transparent border border-gray-300 rounded-md h-10 px-2 mt-3 text-sm"
                >
                  <option value="">- Select City -</option>
                  {cityData?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-6 flex md:flex-row flex-col md:items-center md:gap-5 gap-6">
              <div className="flex-1">
                <label htmlFor="district" className="text-sm">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={userData.district}
                  onChange={handleChange}
                  id="district"
                  className="bg-background w-full outline-0 bg-transparent border border-gray-300 rounded-md h-10 px-2 mt-3 text-sm"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="postalCode" className="text-sm">
                  Postal Code
                </label>
                <input
                  type="number"
                  name="postalCode"
                  value={userData.postalCode}
                  onChange={handleChange}
                  id="postalCode"
                  className="bg-background w-full outline-0 bg-transparent border border-gray-300 rounded-md h-10 px-2 mt-3 text-sm"
                  min={1}
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="skills" className="text-sm">
                Skills
              </label>
              <div className="border border-gray-300 mt-3 rounded-md flex items-center px-2 min-h-20 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap my-2">
                  {skills.map((item, idx) => (
                    <div
                      key={item}
                      className="rounded-md bg-gray-100 px-3 py-1 flex items-center gap-2 break-words"
                    >
                      <p className="text-sm">{item}</p>
                      <div className="bg-gray-300 text-gray-600 w-fit rounded-full p-1 cursor-pointer">
                        <AiOutlineClose
                          onClick={() => handleRemoveSkill(idx)}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  onKeyUp={(e) => handleChangeSkills(e)}
                  className="outline-0 text-sm w-full px-2 h-10 flex-1"
                />
              </div>
            </div>
            <div className="mb-9">
              <label htmlFor="about" className="text-sm">
                About (1 paragraph)
              </label>
              <textarea
                id="about"
                name="about"
                value={userData.about}
                onChange={handleChange}
                className="bg-background outline-0 border border-gray-300 rounded-md h-10 text-sm px-2 w-full mt-3 resize-none py-2 h-32"
              />
            </div>
            <button
              className={`${
                alert.loading
                  ? "bg-gray-200 hover:bg-gray-200 cursor-auto"
                  : "bg-[#504ED7] hover:bg-[#2825C2] cursor-pointer"
              } transition-[background] text-sm w-full py-3 text-white rounded-sm`}
            >
              {alert.loading ? <Loader /> : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
      <Footer />

      {(tempCv.length > 0 || userData.cv) && (
        <CVModal
          openModal={openCVModal}
          setOpenModal={setOpenCVModal}
          file={
            tempCv.length > 0 ? URL.createObjectURL(tempCv[0]) : userData.cv
          }
        />
      )}
    </>
  );
};

export default EditProfile;
