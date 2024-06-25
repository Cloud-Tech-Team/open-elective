import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [selectedCourse, setSelectedCourse] = useState("");
  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  interface Course {
    courseId: string;
    courseName: string;
  }

  const courses: Course[] = [
    { courseId: "1", courseName: "Course 1" },
    { courseId: "2", courseName: "Course 2" },
    { courseId: "3", courseName: "Course 3" },
    { courseId: "4", courseName: "Course 4" },
    { courseId: "5", courseName: "Course 5" },
    { courseId: "6", courseName: "Course 6" },
  ];

  const Registered = () => {
    navigate("/registered");
  };

  const [isLoading, setIsLoading] = useState(false);
  const toggleLoading = () => {
    setIsLoading(!isLoading);
  };

  return (

    // container
    <div className="w-full h-screen bg-slate-900 text-white flex flex-col   items-center justify-evenly md:items-start md:px-5 md:py-5 text-[1.4rem]">

      {/* blob 1 (soft blur) */}
      <div className=" absolute blobs top-[10%]  w-[10rem] h-[10rem] bg-white/50  blur-[7rem] "></div>

      {/* first div */}

      <div className="w-[90%] md:w-[49%] md:h-[60%] h-fit bg-white/10 backdrop:blur-lg rounded-[2rem]  px-5 py-5 md:mb-4 border-b-2 border-t-2 border-gray-500    ">
        <h2 className="text-[2.2rem] font-bold">Welcome username</h2>

        <h3 className=" font-medium py-2">Selected course :</h3>
        <div className="border-2 border-white/50 my-4 rounded-full py-2 flex items-center justify-center ">
          <h3 className="text-[1.2rem] ">Mechanical engineeing</h3>
        </div>
      </div>

      {/* second div */}
      <div className="w-[90%] h-max md:w-[48%] md:h-[90%] md:absolute right-5 md:  bg-white/10 rounded-[2rem] px-5 py-6 border-b-2 border-t-2 border-gray-500 ">
        <h2 className="text-[2rem] font-bold ">Select course:</h2>
        <select
          value={selectedCourse}
          onChange={handleCourseChange}
          className="course-selection-form w-[100%] bg-transparent border-2 border-white/50 py-3 px-6 rounded-full my-5"
          required
        >
          {courses.map((course, index) => (
            <option
              key={index}
              value={course.courseId}
              className="bg-slate-900"
            >
              {course.courseName}
            </option>
          ))}
        </select>

        <h4 className="font-medium py-3">Seats Available : 60</h4>
        <p className="text-[1rem] leading-[1]">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut ipsum
          blanditiis voluptatem natus id perferendis recusandae hic reiciendis
          porro,{" "}
        </p>
      </div>

      {/* third div */}
      <div className="w-[90%] md:w-[49%] h-max md:h-[30%] flex justify-center items-center bg-white/10 rounded-[2rem] py-10 border-t-2 border-b-2 border-gray-500 ">
        <button className={` ${isLoading ? 'loading' : ''} w-[80%] transition-all cubic duration-300 text-slate-900 bg-white hover:bg-slate-600 focus:text-white hover:text-white focus:bg-slate-600 font-medium rounded-full text-[1.5rem] px-5 py-2.5 text-center flex justify-center items-center`} type="button" onClick={toggleLoading} >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 101" className="w-4 h-4 mr-3 text-white hidden" role="status" aria-hidden="true">
            <circle fill="#ffffff" r="45" cy="50" cx="50"></circle>
          </svg>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>

      </div>
      <div className="loading absolute blobs bottom-[5%] md:right-1/2  w-[10rem] h-[10rem] bg-white/50  blur-[7rem] "></div>
    </div>
  );
};

export default Home;
