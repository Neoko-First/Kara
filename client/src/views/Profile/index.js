import React from "react";
import { Link } from "react-router-dom";

export default function index() {
  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex flex-col justify-center items-center gap-2">
        <div className="w-full flex justify-between">
          <div className="h-[3rem] w-[3rem]"></div>
          <img
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            alt="grdsgfsd"
            className="h-[200px] w-[200px] rounded-full"
          />
          <div>
            <Link to={"/settings"} className="btn btn-circle btn-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="icon icon-tabler icons-tabler-filled icon-tabler-settings"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
              </svg>
            </Link>
          </div>
        </div>
        <h1>Neoko_san</h1>
      </div>
      <div className="flex justify-evenly gap-[20px]">
        <div className="flex flex-col items-center gap-[5px]">
          <div className="stat-title">Abonnés</div>
          <div className="stat-value">1 200</div>
        </div>
        <div className="flex flex-col items-center gap-[5px]">
          <div className="stat-title">Abonnements</div>
          <div className="stat-value">500</div>
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        <h2>Galerie</h2>
        <div className="grid grid-cols-3 grid-rows-2 gap-4">
          <div className="bg-base-200 rounded-lg h-[200px]">
            <img
              src="https://i.pinimg.com/236x/3e/fa/7a/3efa7a43a5b7876494ee77c3a74489d0.jpg"
              alt="voiture"
              className="h-full w-full object-cover rounded-lg "
            />
          </div>
          <div className="bg-base-200 rounded-lg h-[200px]">
            <img
              src="https://w0.peakpx.com/wallpaper/34/245/HD-wallpaper-silvia-s13-jdm-cars-jdm-jdm-nissan-240sx-thumbnail.jpg"
              alt="voiture"
              className="h-full w-full object-cover rounded-lg "
            />
          </div>
          <div className="bg-base-200 rounded-lg h-[200px]">
            <img
              src="https://i.pinimg.com/originals/df/5e/1f/df5e1ffb42541406824cbb2e8c9b4225.jpg"
              alt="voiture"
              className="h-full w-full object-cover rounded-lg "
            />
          </div>
          <div className="bg-base-200 border-dashed border-2 border-accent rounded-lg h-[200px] flex justify-center items-center ">
            <button className="btn btn-circle btn-sm btn-accent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-plus"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 5l0 14" />
                <path d="M5 12l14 0" />
              </svg>
            </button>
          </div>
          <div className="bg-base-200 border-dashed border-2 border-accent rounded-lg h-[200px] flex justify-center items-center">
            {" "}
            <button className="btn btn-circle btn-sm btn-accent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-plus"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 5l0 14" />
                <path d="M5 12l14 0" />
              </svg>
            </button>
          </div>
          <div className="bg-base-200 border-dashed border-2 border-accent rounded-lg h-[200px] flex justify-center items-center">
            <button className="btn btn-circle btn-sm btn-accent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-plus"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 5l0 14" />
                <path d="M5 12l14 0" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
