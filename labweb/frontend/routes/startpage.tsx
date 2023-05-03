import React from 'react'

function StartPage() {
  return (
    <div className="text-xl text-secondary w-4/5 font-primaryfont text-left"><h1 className='text-4xl text-center text-secondary font-logofont font-medium'>Motion Tracker Lab</h1>
    <br>
    </br>
    

A novel low cost hardware and open-source software solution to explore basic concepts of kinematics using computer vision techniques. Our motion tracker system consists of a
webcam (with tripod or other mounting platform), a calibration
poster board representing the reference frame, and a cart with a colored trackable sticker
attached to it. The software interface is web-based and is controlled through either a laptop or a
smartphone. The software allows students to initialize and calibrate the system, collect the
position and time data, filter the data, plot various graphs, and save the raw and processed data
for further analysis.

<br>
    </br>
    <br>
    </br>

The validity and reliability of our position measurements were determined by comparing
the results from our motion tracker system to those obtained by a Qualisys optical motion
capture system (which is the industry gold standard method of determining the location of an
object in space). Overall, our system was shown to be both reliable and valid, easy to use by
students, and conceptually a better method for collecting data to understand kinematics.
    </div>
  )
}

export default StartPage