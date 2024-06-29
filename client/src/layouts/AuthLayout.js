import React from "react";
import { Link, Outlet } from "react-router-dom";
import Logo from "../components/Logo";

export default function AuthLayout() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative">
      <div className="absolute top-[30px] flex items-center">
        <div className="h-[40px] w-[40px]">
          <Logo />
        </div>
        <h1 className="text-4xl font-bold permanent-marker-regular">KARA</h1>
      </div>
      <div className="w-[90%] phone:w-[90%] tablet:w-[80%] laptop:w-[70%] desktop:w-[50%] tv:w-[50%] max-w-[645px]">
        <Outlet />
      </div>
      <div className="absolute bottom-0 w-full flex justify-center h-[50px]">
        <p className="flex items-center font-bold">
          Développé avec passion par&nbsp;
          <Link
            target="_blank"
            className="underline font-bold"
            // to="https://www.roulemarcel.fr/"
            rel="noopener noreferrer"
          >
            Alexandre Artisien
          </Link>
        </p>
      </div>
    </div>
  );
}
