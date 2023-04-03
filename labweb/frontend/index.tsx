import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from "./routes/root";
import Output from "./routes/output"
import Experiment from "./routes/experiment"
import Debug from "./routes/debug"
import ErrorPage from "./routes/error-page";
import Calibration1 from './routes/calibration/calibration1';
import Calibration2 from './routes/calibration/calibration2';
import Calibration3 from './routes/calibration/calibration3';
import StartPage from './routes/startpage';


// Creating the router for our SPA
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/", // Default route
        element: <StartPage />,
      },
      {
        path: "/calibration1", // Default route
        element: <Calibration1 />,
      },
      {
        path: "/calibration2", // Default route
        element: <Calibration2 />,
      },
      {
        path: "/calibration3", // Default route
        element: <Calibration3 />,
      },
      {
        path: "/experiment", // Default route
        element: <Experiment />,
      },
      {
        path: "/output", // Default route
        element: <Output />,
      },
      {
        path: "/debug", // Default route
        element: <Debug />,
      },
    ],
  },
]);


// Getting the DOM element in which to insert our react app
const container = document.getElementById('app')!;
// Creating our root in the react app
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
