// Code to remember (personal use only)


//const Markers: CalibrationCoordinatesPixels = {
    //     tl: {x:0, y:0, title: "Top Left"},
    //     tm: {x:0, y:0, title: "Top Middle"},
    //     tr: {x:0, y:0, title: "Top Right"},
    //     bl: {x:0, y:0, title: "Bottom Left"},
    //     bm: {x:0, y:0, title: "Bottom Middle"},
    //     br: {x:0, y:0, title: "Bottom Right"}
    //     }

     // const newButtonTexts = { ...buttonTexts };
        // newButtonTexts[selectedButton] = `(${x}, ${y})`;
        // setButtonTexts(newButtonTexts);


        // eventBus.on("cameraFeedClickEvent", (point: any) => {
    //     console.log(point)
    // })

    // || (buttonTexts[buttonId] && buttonId !== selectedButton)

    // const [buttonTexts, setButtonTexts] = useState<{ [id: string]: string }>({});

    // const newButtonTexts = { ...buttonTexts };
        // newButtonTexts[selectedButton] = `(${x}, ${y})`;
        // setButtonTexts(newButtonTexts);




        //Calibration 2 page




        // const Markers: CalibrationCoordinatesPixels = [
//   {
//     title: "Top Left",
//     x: "X",
//     y: "Y",
//   },
//   {
//     title: "Bottom Left",
//     x: "X",
//     y: "Y",
//   },
//   {
//     title: "Top Mid",
//     x: "X",
//     y: "Y",
//   },
//   {
//     title: "Bottom Mid",
//     x: "X",
//     y: "Y",
//   },
//   {
//     title: "Top Right",
//     x: "X",
//     y: "Y",
//   },{
//     title: "Bottom Right",
//     x: "X",
//     y: "Y",
//   }
// ]


/* 
        <div className="w-2/3 flex space-y-2 flex-col drop-shadow-md justify-center items-center h-[200px] bg-[#DFE7EE] rounded-md">
          <h1 className='text-xl font-medium font-primaryfont'> Select the Markers</h1>
          <p className='text-sm font-primaryfont font-regular'> Click the buttons below and select the corresponding marker on the camera view one at a time</p>

          <div className='grid grid-cols-3 gap-x-6 gap-y-3'>
            {Object.entries(Markers).map(([key, value]) => {
                    return (
                  <div key={key} className='flex items-center justify-center w-48 h-8 p-2 text-center bg-red-100 border-2 border-red-600 rounded-md cursor-pointer group hover:border-green-600 hover:bg-green-100 '>
                    <div className='text-red-600 group-hover:text-green-600 basis-3/5'>{value.title}</div>
                    <div className='text-gray-800 border-l-2 border-red-600 basis-1/5 group-hover:border-green-600'>{value.x}</div>
                    <div className='text-gray-800 border-l-2 border-red-600 basis-1/5 group-hover:border-green-600'>{value.y}</div>
                  </div> 
                    )})}
          </div>

          
          
        </div> */



        // Calibration 3 

        // <div className="w-2/3 flex space-y-4 flex-col drop-shadow-md justify-center items-center h-[200px] bg-[#DFE7EE] rounded-md">
        //   <h1 className='text-xl font-medium font-primaryfont'> Select the Target</h1>
        //   <p className='px-2 text-sm text-center font-primaryfont font-regular'>Click the buttons below and select the corresponding marker on the camera view one at a time</p>

            
        //   <div id={key} onClick={() => handleButtonClick(key)} className={`flex group box-border cursor-pointer w-52 rounded-md text-center justify-center items-center border-2  hover:border-green-600 hover:bg-green-100 ${getButtonClass(key)}`}> 
        //       <div className=' group-hover:text-green-600 p-1 basis-[66%]'>{value.title}</div>
        //       <div className='text-gray-800 basis-[19%] p-1  bg-white border-l-2 border-gray-600 group-hover:border-green-600'>{value.x}</div>
        //       <div className='text-gray-800 basis-[19%] p-1  bg-white border-l-2 border-gray-600 group-hover:border-green-600'>{value.y}</div>
        //   </div> 