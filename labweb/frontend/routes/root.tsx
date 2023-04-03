import React from 'react';
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Outlet, NavLink } from "react-router-dom";

import Sidebar from '../components/sidebar';


export default function Root() {

    return (
      <>
        {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-gray-100">
          <body class="h-full">
          ```
        */}
        <div className="flex min-h-screen">

          <Sidebar />

          

          <main className='basis-4/5 flex items-center justify-center min-h-full bg-white'> 
            <Outlet />
          </main>

          

        </div>
      </>
    );
  }