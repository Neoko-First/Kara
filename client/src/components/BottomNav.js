import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  IconMapSearch,
  IconMessages,
  IconSwipe,
} from "@tabler/icons-react";

export default function BottomNav() {
  const location = useLocation();

  return (
    <div className="btm-nav bg-base-200 relative">
      <Link
        className={location.pathname === "/events" ? "active bg-primary" : ""}
        to="/events"
      >
        <IconMapSearch />
      </Link>
      <Link
        className={location.pathname === "/" ? "active bg-primary" : ""}
        to="/"
      >
        <IconSwipe />
      </Link>
      <Link
        className={location.pathname === "/messages" ? "active bg-primary" : ""}
        to="/messages"
      >
        <IconMessages />
      </Link>
    </div>
  );
}
