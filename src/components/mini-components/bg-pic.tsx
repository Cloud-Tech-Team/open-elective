import React from 'react'

const Background = () => {
  return (
    <div className="w-screen h-[150vh] md:h-screen absolute top-0 left-0 z-[-1] ">
        <img src="/assets/images/grainy.jpg" alt="" className="hidden md:block" />
        <img src="./assets/images/grain-mobile.jpg" alt="" className="md:hidden" />
      </div>
  )
}

export default Background