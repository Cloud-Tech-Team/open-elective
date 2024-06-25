import React from 'react'
import 'remixicon/fonts/remixicon.css'
import Instructions from './instructions'
import Forms from './form'

const Login = () => {
  return (
    <>
      <div className=' w-[100%] min-h-screen md:h-screen  md:py-[1em bg-slate-900  backdrop:blur-[15px] relative flex gap-[1em] justify-center items-center text-white flex-col md:flex-row'>
        
        <Instructions />
        <Forms />
      </div>
    </>
  )
}

export default Login