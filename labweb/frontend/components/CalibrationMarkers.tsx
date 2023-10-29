
import React, { useState, useEffect } from 'react';
import { useCoordinateStore, useImageClick } from '../store';


const CalibrationMarkers = ({Markers, setMarkers}: any) => {

  const clicked = useImageClick((state) => state.clicked);

  // State to keep track of the selected button
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  // function to track the button clicked
  const handleButtonClick = (buttonKey: string) => {
    useImageClick.getState().setClicked(true);
    console.log("button is clicked. true now!");
    setSelectedButton(buttonKey);
  };

  // Get the coordinates of the recently clicked coordinates from the store.ts 
  const { X, Y } = useCoordinateStore(state => ({
    X: state.X,
    Y: state.Y,
  }));
  
  // useEffect to run the function when the clicked state changes
  useEffect(() => {
    if (!clicked) {

      // Check if a button is selected
      if (selectedButton !== null) {
        
        // Update the markers state with the new coordinates
        const newMarkers = { ...Markers };
        newMarkers[selectedButton].x = Number(X);
        newMarkers[selectedButton].y = Number(Y);
        setMarkers(newMarkers);

        // Clear the selected button
        setSelectedButton(null);
      }
      
    }
  }, [clicked]);

  
  // Function to get the style the buttons when selected or done selecting
  const getButtonClass = (buttonId: string): string => {
    if (selectedButton === buttonId || Markers[buttonId].x !== 0) {
      return 'border-green-600 bg-green-100 text-green-600 drop-shadow-lg';
    } else {
      return 'border-red-600 bg-red-100';
    }
  };

  return (
    <div className="w-2/3 p-4 flex space-y-2 flex-col drop-shadow-md justify-center items-center bg-[#DFE7EE] rounded-md">
     
      {/* title and description here */}
      <h1 className='text-xl font-medium font-primaryfont'> Select the Markers</h1>
      <p className='text-sm font-primaryfont font-regular'> Click the buttons below and select the corresponding marker on the camera view one at a time</p>
      
      {/* six button grid */}
      <div className='grid grid-cols-1 laptop:grid-cols-3 gap-x-6 gap-y-3'>
          {Object.entries(Markers).map(([key, value]) => {
                  return (
                <div key={key} id={key} onClick={() => handleButtonClick(key)} className={`flex group box-border cursor-pointer w-52 rounded-md text-center justify-center items-center border-2  hover:border-green-600 hover:bg-green-100 ${getButtonClass(key)}`}> 
                  <div className=' group-hover:text-green-600 p-1 basis-[66%]'>{value.title}</div>
                  <div className='text-gray-800 basis-[19%] p-1  bg-white border-l-2 border-gray-600 group-hover:border-green-600'>{value.x}</div>
                  <div className='text-gray-800 basis-[19%] p-1  bg-white border-l-2 border-gray-600 group-hover:border-green-600 rounded-r-lg'>{value.y}</div>
                </div> 
                  )})}
      </div>

    </div>
  );
};

export default CalibrationMarkers;


















// Calibration Marker with Canvas Element




// import React, { useState, useRef } from 'react';


// const CalibrationMarkers = ({Markers, setMarkers}) => {

//     const [selectedButton, setSelectedButton] = useState<string | null>(null);
//     const canvasRef = useRef<HTMLCanvasElement>(null);

//     const handleButtonClick = (buttonKey: string) => {
//       setSelectedButton(buttonKey);
//     };

//     const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
//       if (selectedButton !== null && canvasRef.current !== null) {
//         const canvasRect = canvasRef.current.getBoundingClientRect()
//         const x = (event.clientX - canvasRect.left).toFixed(0);
//         const y = (event.clientY - canvasRect.top).toFixed(0);
       

//         const secondChild = document.querySelector(`#${selectedButton} :nth-child(2)`);
//         const thirdChild = document.querySelector(`#${selectedButton} :nth-child(3)`);

//         secondChild.innerHTML = (`${x}`);
//         thirdChild.innerHTML = (`${y}`);

//         const newMarkers = { ...Markers };
//         newMarkers[selectedButton].x = Number(x);
//         newMarkers[selectedButton].y = Number(y);
//         setMarkers(newMarkers);

//         setSelectedButton(null);

//       }
//     };

//     const getButtonClass = (buttonId: string): string => {
//       if (selectedButton === buttonId || Markers[buttonId].x !== 0) {
//         return 'border-green-600 bg-green-100 text-green-600 drop-shadow-lg';
//       } else {
//         return 'border-red-600 bg-red-100';
//       }
//     };
      
//   return (
//         <div className="w-2/3 p-4 flex space-y-2 flex-col drop-shadow-md justify-center items-center bg-[#DFE7EE] rounded-md">
//           <canvas className="bg-white w-[200px]" ref={canvasRef} onClick={handleCanvasClick} />
//           <h1 className='text-xl font-medium font-primaryfont'> Select the Markers</h1>
//           <p className='text-sm font-primaryfont font-regular'> Click the buttons below and select the corresponding marker on the camera view one at a time</p>

//           <div className='grid grid-cols-1 laptop:grid-cols-3 gap-x-6 gap-y-3'>
//             {Object.entries(Markers).map(([key, value]) => {
//                     return (
//                   <div key={key} id={key} onClick={() => handleButtonClick(key)} className={`flex group box-border cursor-pointer w-52 rounded-md text-center justify-center items-center border-2  hover:border-green-600 hover:bg-green-100 ${getButtonClass(key)}`}> 
//                     <div className=' group-hover:text-green-600 p-1 basis-[66%]'>{value.title}</div>
//                     <div className='text-gray-800 basis-[19%] p-1  bg-white border-l-2 border-gray-600 group-hover:border-green-600'>{value.x}</div>
//                     <div className='text-gray-800 basis-[19%] p-1  bg-white border-l-2 border-gray-600 group-hover:border-green-600 rounded-r-lg'>{value.y}</div>
//                   </div> 
//                     )})}
//           </div>
//         </div>
    
//   )
// }

// export default CalibrationMarkers

