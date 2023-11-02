import React, { useState, useEffect } from 'react';
import ObjectTable from '../../components/table';

import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
    PlusCircleIcon,
  } from '@heroicons/react/24/solid'
  
// below code is for parsing the csv file and displaying it in a table: still working on it!
export default function Output() {

    
    return (
        <div className='relative flex flex-col justify-center items-center w-4/5 h-4/5 shadow-lg rounded-lg bg-[#DFE7EE]'>
            <div className='w-2/3 h-[50px] flex flex-row absolute top-0 bg-white shadow-md rounded-md'>
                <div className='w-1/2 border-r-2 border-[#DFE7EE] flex flex-row items-center justify-center'><div className='flex flex-row items-center justify-center gap-2 text-lg cursor-pointer'><h1>Experiment</h1><ChevronDownIcon className='text-black font-bold w-[15px] h-[15px]'/> </div></div>
                <div className='w-1/2 border-l-2 border-[#DFE7EE] flex justify-center items-center'> <MagnifyingGlassIcon className='text-black font-bold w-[20px] h-[20px]'/> </div>
            </div>
            <PlusCircleIcon className='absolute cursor-pointer hover:text-secondary right-8 bottom-8 text-primary font-bold w-[70px] h-[70px]'/>
            <ObjectTable />
        </div>
        
    );
}




