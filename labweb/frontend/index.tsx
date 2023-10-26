import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from "./routes/root";
import Output from "./routes/output/output"
import Experiment1 from "./routes/experiment/experiment1";
import Experiment2 from "./routes/experiment/experiment2";
import Debug from "./routes/setting/debug";
import ErrorPage from "./routes/setting/error-page";
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
      // {
      //   path: "/", // Default route
      //   element: <StartPage />,
      // },
      {
        path: "/" || "/calibration1", 
        element: <Calibration1 />,
      },
      {
        path: "/calibration2", 
        element: <Calibration2 />,
      },
      {
        path: "/calibration3", 
        element: <Calibration3 />,
      },
      {
        path: "/experiment1", 
        element: <Experiment1 />,
      },
      {
        path: "/experiment2", 
        element: <Experiment2 />,
      },
      {
        path: "/output", 
        element: <Output />,
      },
      {
        path: "/debug", 
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
