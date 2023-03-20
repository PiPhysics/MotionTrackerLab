import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from "./routes/root";
import Home from "./routes/home"
import Calibration from "./routes/calibration"
import DataCollection from "./routes/datacollection"
import Debug from "./routes/debug"
import ErrorPage from "./routes/error-page";



// Creating the router for our SPA
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/", // Default route
        element: <Home />,
      },
      {
        path: "/calibration", // Default route
        element: <Calibration />,
      },
      {
        path: "/datacollection", // Default route
        element: <DataCollection />,
      },
      {
        path: "/debug", // Default route
        element: <Debug />,
      },
    ],
  },
]);

// const Application: React.FC<{}> = () => (
//   <VideoFeed></VideoFeed>
// );

// Getting the DOM element in which to insert our react app
const container = document.getElementById('app')!;
// Creating our root in the react app
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
