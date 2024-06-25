import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Forms = () => {

  const [, setUsername] = useState('');

  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/home')
  }

  return (
    <>
      <div className='drop-shadow-1 border-white/50 border-[1px] relative md:w-[50%] w-[90%] py-5 my-[1em] justify-center h-[60vh] flex flex-col items-center  md:h-[90vh] md:mr-5   rounded-xl bg-white/10 backdrop:blur-large z-10'>
        <div><h1 className='text-shadow text-[4rem] font-medium text-left  '>Register</h1></div>
        <form className='flex flex-col gap-2 w-[80%]  '>
          <input type='text' placeholder='Username' className='cubic-1 drop-shadow input  p-2 bg-transparent border-b-2 border-white text-white hover:placeholder:text-dark-offset rounded placeholder:text-white/80  ' />
          <input type='email' placeholder='Your college email ID' className='cubic-1 drop-shadow input  p-2 bg-transparent border-b-2 border-white text-white hover:placeholder:text-dark-offset rounded placeholder:text-white/80  ' />
          <input type='text' placeholder='Register No.' className='cubic-1 drop-shadow input  p-2 bg-transparent border-b-2 border-white text-white hover:placeholder:text-dark-offset rounded placeholder:text-white/80  ' />
          <button onClick={goToHome} className='p-2 font-bold   text-[1.4rem] bg-white rounded text-dark-offset mt-[2em] '>Next</button>
        </form>

        <div className="blobs"></div>

      </div>
      <div className="blobs  w-[15rem] h-[15rem] blur-[2rem] bg-white/10 absolute top-[55%] md:top-[10%] md:left-[45 %] z-[0] "></div>
    </>
  )
}

export default Forms