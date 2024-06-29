import React from "react";
import { Link } from "react-router-dom";

export default function index() {
  return (
    <div className="flex flex-col gap-[20px]">
      <h1>Messages</h1>
      {[...Array(10)].map((_, i) => (
        <Link
          to={"/messages/" + i}
          className="bg-base-200 w-full flex items-center gap-[20px] p-[10px] rounded-lg"
        >
          <div className="flex gap-[10px]">
            <img
              className="rounded-full w-[4.375rem] h-[4.375rem] "
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              alt="grdsgfsd"
            />
            <div className="w-full">
              <p className="font-bold">John Doe</p>
              <p className="text-xs">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
