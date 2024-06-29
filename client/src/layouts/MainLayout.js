import React from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <div className="h-full w-full">
      <Header />
      <div
        style={{ height: "calc(100% - 128px)" }}
        className="w-full flex flex-col items-center justify-center relative"
      >
        <div className="h-full w-[90%] phone:w-[90%] tablet:w-[80%] laptop:w-[70%] desktop:w-[50%] tv:w-[50%] max-w-[645px] py-[20px] overflow-auto">
          <Outlet />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
