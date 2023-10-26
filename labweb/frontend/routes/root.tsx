import React, { useEffect, useState } from 'react';
import { Outlet, NavLink } from "react-router-dom";

import Sidebar from '../components/sidebar';

// this is the root component that is rendered in index.tsx
export default function Root() {

  // below is the code that changes the display of the website based on the screen size
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
        {/* if the screen size is smaller than 768px, display the following comment */}
        {screenSize < 768 && (
          <div className='flex flex-col items-center justify-center w-full h-screen gap-3 bg-primary'>
            <div className='mt-10 text-4xl font-semibold text-white font-logofont'>Motion Tracker</div>
            <h1 className='px-4 text-2xl'>Sorry, this website is only accessible on a tablet or larger screen.</h1>
          </div>
        )}
        
        {/* if the screen size is larger than 768px, display the sidebar and the main content */}
        {screenSize >= 768 && 
        <div className="flex min-h-screen">

        <Sidebar />
        
        {/* the main content goes here! */}
        <main className='basis-[75%] flex items-center justify-center min-h-full bg-white'> 
          <Outlet />
        </main>

        </div>}
      </>
    );
  }