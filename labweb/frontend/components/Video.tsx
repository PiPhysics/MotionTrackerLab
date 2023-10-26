import React from 'react'

// below is the code for capturing the coordinates of the image as user clicks on it. 
export function imageOnClick(e: any) { 
  var ratioX = e.target.naturalWidth / e.target.offsetWidth;
  var ratioY = e.target.naturalHeight / e.target.offsetHeight;
  var domX = e.pageX + window.scrollX - e.target.offsetLeft;
  var domY = e.pageY + window.scrollY - e.target.offsetTop;
  var imgX = Math.floor(domX * ratioX);
  var imgY = Math.floor(domY * ratioY);

  console.log(imgX, imgY);
};

// below is the code for displaying the video feed from the camera
export const Video = () => {
  return (
    <div id="root" className="mx-auto">
      <img id="cameraFeed" className="mx-auto" src="/api/video_feed?freq=5" onClick={imageOnClick} ></img>
    </div>
  )
}




