import { lazy } from "react";

// import { ProtectedRoutes } from "./ProtectedRoutes";

const MainLayout = lazy(() => import("../layouts/MainLayout"));

const Swiper = lazy(() => import("../views/Swiper"));
const Messages = lazy(() => import("../views/Messages"));
const Events = lazy(() => import("../views/Events"));
const Conversation = lazy(() => import("../views/Messages/Conversation"));
const Profile = lazy(() => import("../views/Profile"));
const Settings = lazy(() => import("../views/Settings"));

const NotFound = lazy(() => import("../views/NotFound"));

const MembersRoutes = {
  path: "/",
  // element: <ProtectedRoutes />,
  children: [
    {
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Swiper />,
        },
        {
          path: "events",
          element: <Events />,
        },
        {
          path: "messages",
          element: <Messages />,
        },
        {
          path: "messages/:id",
          element: <Conversation />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
};

export default MembersRoutes;
