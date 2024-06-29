import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="h-[64px] bg-base-200 flex justify-between items-center px-[20px]">
      <div className="w-[48px]"></div>
      <div className="flex items-center justify-center gap-[10px]">
        <div className="h-[35px] w-[35px]">
          <Logo />
        </div>
        <p className="permanent-marker-regular text-3xl">KARA</p>
      </div>
      <div>
        <Link
          to="/profile"
          tabIndex={0}
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
