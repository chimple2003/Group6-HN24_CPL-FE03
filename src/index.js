import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { HoxRoot } from "hox";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TopicInitiate from "./pages/TopicIntiate";
import TopicDetails from "./pages/TopicDetails";
import TopicUpdate from "./pages/TopicUpdate";
import Profile from "./pages/Profile";
import Tags from "./pages/Tags";
import TagPage from "./pages/TagPage";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
  { path: "/", element: <Homepage /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/topic/initiate", element: <TopicInitiate /> },
  { path: "/topic/:slug", element: <TopicDetails /> },
  { path: "/topic/update/:_id", element: <TopicUpdate /> },
  { path: "/profile/:username", element: <Profile /> },
  { path: "/settings", element: <Settings /> },
  { path: "/tags", element: <Tags /> },
  { path: "/tags/:tag", element: <TagPage /> },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HoxRoot>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </HoxRoot>
);
