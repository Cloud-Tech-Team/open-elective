import { register } from 'module';
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate();

  const Registered = () => {
    navigate('/registered');
  }

  return (
    <div className='w-full min-h-screen md:min-h-[120vh] relative bg-slate-900 text-white'>
      <div className=' md:w-[100%] w-full  md:h-[100vh]    border-dark-off'>

        <h1 className='text-[1.7rem] px-2 py-4 font-bold w-[100%] border-b-2 leading-tight  border-dark-off'>Welcome Username
        </h1>

        <div className='relative py-[2%] md:flex  '>

          <div className=' w-full flex flex-col  py-3'>
            <h3 className='text-[1.5rem] px-3  font-medium '>Selected  branch </h3>

            <section className='relative w-[100%] flex flex-col items-center py-3 border-dark-off border-b-2 md:border-none'>
              <div className="branch-card">
                <input type="radio" id='mechanical' name='branch' />
                <label htmlFor="mechanical">Mechanical Engineering</label>
              </div>

            </section>

          </div>

          <div className=' w-full h-[50vh] '>
            <h1 className='text-[1.5rem] px-3 md:px-5 font-medium my-3'>Choose your course </h1>

            <section className='relative w-full flex flex-col items-center '>
              <div className="courses-card">
                <input type="radio" name='course' id='course1' />
                <label htmlFor="course1">Course Name</label>
              </div>
              <div className="courses-card">
                <input type="radio" name='course' id='course2' />
                <label htmlFor="course2">Course Name</label>
              </div>
              <div className="courses-card">
                <input type="radio" name='course' id='course3' />
                <label htmlFor="course3">Course Name</label>
              </div>
              <div className="courses-card">
                <input type="radio" name='course' id='course4' />
                <label htmlFor="course4">Course Name</label>
              </div>
              <div className="courses-card">
                <input type="radio" name='course' id='course5' />
                <label htmlFor="course5">Course Name</label>
              </div>
              <div className="courses-card">
                <input type="radio" name='course' id='course6' />
                <label htmlFor="course6">Course Name</label>
              </div>
            </section>

            <h2 className=' text-[1.4rem] font-[500] pt-6  px-2 md:px-5  w-[100%]'>Selected course : nigga cat </h2>
            <h2 className=' text-[1.4rem] font-[500] pb-6 px-2  md:px-5 w-[100%] border-b-2 md:border-none border-dark-off'>Seats
              available : 60 </h2>

          </div>

          <div className="line hidden md:block w-[2px] h-[184%] bg-dark-off absolute left-[50%] top-0 "></div>
        </div>
        <div className="blobs w-[6rem] h-[6rem] absolute bottom-0 left-0 md:blur-[6rem] bg-white/70 z-[0]  blur-[5rem]">
        </div>
        <div className="blobs w-[6rem] h-[6rem] absolute bottom-0 right-0  md:blur-[6rem] bg-white/70 z-[0]  blur-[5rem]">
        </div>
      </div>
      <div className='w-full h-[20vh] border-dark-off md:border-t-2  mt-[10%] flex items-center justify-center'>
        <button onClick={Registered} className=' w-[70%] md:w-[50%] bg-dark-off text-[#0e0e0e] font-bold text-[1.5rem] py-3 px-[2em] rounded-[3rem] cursor-pointer'>Submit</button>
      </div>
    </div>
  )
}

export default Home