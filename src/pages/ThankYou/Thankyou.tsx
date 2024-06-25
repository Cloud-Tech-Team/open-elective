import React from 'react'

const Thankyou = () => {
  return (
    <>
      <div className='w-full h-screen bg-slate-900 flex items-center justify-center'>
        <h1 className='text-3xl leading-tight text-center px-3 font-medium text-white' >
          Thank you for registering.
          Your registration is successful.
        </h1>
      </div>
      <div className="blobs w-[8rem] h-[8rem] absolute bottom-0 right-0  md:blur-[8rem] bg-white z-[0]  blur-[6rem]">
      </div>
      <div className="blobs w-[8rem] h-[8rem] absolute top-10 left-0  md:blur-[8rem] bg-white z-[0]  blur-[6rem]">
      </div>
    </>
  )
}

export default Thankyou