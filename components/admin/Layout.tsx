import { ReactElement } from "react";
import Head from "next/head";
import AppSidebar from "../modern-layout/app-sidebar";

interface IProps {
  title: string;
  pageTitle?: string;
  children: ReactElement;
}

const Layout = ({ title, pageTitle, children }: IProps) => {
  return (
    <>
      <Head>
        <title>Resource AI | {title}</title>
      </Head>
      <div className="flex h-screen">
        <AppSidebar>
          {
            <div className="flex-[16]">
              <div className={`px-10 ${!pageTitle ? "mb-7" : undefined}`}>
                {pageTitle && (
                  <h1 className="font-medium text-xl mb-7">{pageTitle}</h1>
                )}
                {children}
              </div>
            </div>
          }
        </AppSidebar>
      </div>
    </>
  );
};

export default Layout;
