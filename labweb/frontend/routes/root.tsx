import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { Outlet, NavLink } from "react-router-dom";

import Sidebar from '../components/sidebar';


export default function Root() {

  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setScreenSize(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

    return (
      <>
        {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-gray-100">
          <body class="h-full">
          ```
        */}

            {screenSize < 768 && (
              <div className='flex flex-col items-center justify-center w-full h-screen gap-3  bg-primary'>
                <div className='mt-10 text-4xl font-semibold text-white font-logofont'>Motion Tracker</div>
                <h1 className='px-4 text-2xl'>Sorry, this website is only accessible on a tablet or larger screen.</h1>
              </div>
            )}
        

        {screenSize >= 768 && 
        <div className="flex min-h-screen">

          <Sidebar />

          

          <main className='basis-[75%] flex items-center justify-center min-h-full bg-white'> 
            <Outlet />
          </main>

        </div>}
      </>
    );
  }