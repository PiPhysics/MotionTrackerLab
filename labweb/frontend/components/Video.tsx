import React from 'react'
import eventBus from "../eventBus"

function imageOnClick(e: any) { 
  var ratioX = e.target.naturalWidth / e.target.offsetWidth;
  var ratioY = e.target.naturalHeight / e.target.offsetHeight;
  var domX = e.pageX + window.pageXOffset - e.target.offsetLeft;
  var domY = e.pageY + window.pageYOffset - e.target.offsetTop;
  var imgX = Math.floor(domX * ratioX);
  var imgY = Math.floor(domY * ratioY);

  // console.log(imgX, imgY);
  eventBus.dispatch("cameraFeedClickEvent", { x:imgX, y:imgY});
};


const Video = () => {
  return (
    <div id="root" className="mx-auto">
      <img id="cameraFeed" className="mx-auto" src="/api/video_feed?freq=5" onClick={imageOnClick} ></img>
    </div>
  )
}

export default Video


