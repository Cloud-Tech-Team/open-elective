import { useState, useEffect } from "react";
import { Course } from "@/types/Course";
import { User } from "@/types/User";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();
  let departmentName: string = "";
  let department: string = "";
  const coursemap = new Map([
    ["cs", "Computer Science"],
    ["me", "Mechanical"],
    ["ec", "Electronics Communication"],
    ["ee", "Electrical Electronics"],
    ["ai", "Artificial Intelligence & Computer Science"],
    ["ad", "Artificial Intelligence & Data Science"],
  ]);



  // fetch in for from localstorage
  const userinfo: User | null = JSON.parse(localStorage.getItem("userInfo")!);
  console.log(userinfo);
  if (userinfo) {
    department = userinfo.department.toLowerCase();
    departmentName = coursemap.get(department) ?? "";
  }

  const [courses, setCourses] = useState<Course[]>([
    { courseId: "", courseName: "", seatsAvailable: 0 },
  ]);
  const [courseId, setcourseID] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [seatsAvailable, setSeatsAvailable] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(!userinfo){
      navigate("/")
    }
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_URL}/courses/allcourses`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ department }),
          }
        );

        const data = await response.json();

        if (data.length === 0) {
          alert("No courses available for this department");
        } else {
          setCourses(data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchData();
  }, []);

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCourse = courses.find(
      (course) => course.courseName === event.target.value
    );

    if (selectedCourse) {
      setSelectedCourse(selectedCourse.courseName);
      setSeatsAvailable(selectedCourse.seatsAvailable);
      setcourseID(selectedCourse.courseId);
    }
  };

  const toggleLoading = () => {
    if (selectedCourse === "") {
      alert("Please select a course");
    } else {
      setIsLoading(!isLoading);
      fetch(`${import.meta.env.VITE_URL}/courses/select`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userinfo?.email,
          courseId: courseId,
        }),
      }).then((response) => {
        if (response.status==412) {
          setIsLoading(!isLoading);
          alert("All seats are filled for this course. Please select another course.");
        }else if(!response.ok){
          setIsLoading(!isLoading);
          alert("Server error. Please try again later.");
        }else{
          localStorage.removeItem("userInfo")
          navigate("/registered");
        }

      });
    }
  };

  return (
    <div className="w-full h-screen bg-slate-900 text-white flex flex-col   items-center justify-evenly md:items-start md:px-5 md:py-5 text-[1.4rem]">
      <div className=" absolute blobs top-[10%]  w-[10rem] h-[10rem] bg-white/50  blur-[7rem] "></div>

      <div className="w-[90%] md:w-[49%] md:h-[60%] h-fit bg-white/10 backdrop:blur-lg rounded-xl  px-5 py-5 md:mb-4 border-b-2 border-t-2 border-gray-500    ">
        <h2 className="text-[2.2rem] font-bold">Welcome {userinfo?.name}</h2>
        <h3 className=" font-medium py-2">Department: </h3>
        <div className="border-2 border-white/50 my-4 rounded-full py-2 flex items-center justify-center ">
          <h3 className="text-[1.2rem] ">{departmentName}</h3>
        </div>
      </div>
      <div className="w-[90%] h-max md:w-[48%] md:h-[90%] md:absolute right-5 md:  bg-white/10 rounded-xl px-5 py-6 border-b-2 border-t-2 border-gray-500 ">
        <h2 className="text-[2rem] font-bold ">Select course:</h2>

        <select
          value={selectedCourse}
          onChange={handleCourseChange}
          className="course-selection-form w-[100%] bg-transparent border-2 border-white/50 py-3 px-6 rounded-full my-5"
          required
        >
          <option value="" disabled>
            Select a course
          </option>
          {courses.map((course) => (
            <option
              key={course.courseId}
              value={course.courseName}
              className="bg-slate-900"
            >
              {course.courseName}
            </option>
          ))}
        </select>

        <h4 className="font-medium py-3">Seats Available : {seatsAvailable}</h4>
        <h4 className="font-medium py-3">Selected Course : {selectedCourse}</h4>
        <p className="text-[1rem] leading-[1]">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut ipsum
          blanditiis voluptatem natus id perferendis recusandae hic reiciendis
          porro,{" "}
        </p>
      </div>

      {/* third div */}
      <div className="w-[90%] md:w-[49%] h-max md:h-[30%] flex justify-center items-center bg-white/10 rounded-[2rem] py-10 border-t-2 border-b-2 border-gray-500 ">
        <button
          className={` ${
            isLoading ? "loading" : ""
          } w-[80%] transition-all cubic duration-300 text-slate-900 bg-white hover:bg-slate-600 focus:text-white hover:text-white focus:bg-slate-600 font-medium rounded-full text-[1.5rem] px-5 py-2.5 text-center flex justify-center items-center`}
          type="button"
          onClick={toggleLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 101"
            className="w-4 h-4 mr-3 text-white hidden"
            role="status"
            aria-hidden="true"
          >
            <circle fill="#ffffff" r="45" cy="50" cx="50"></circle>
          </svg>
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </div>
      <div className="loading absolute blobs bottom-[5%] md:right-1/2  w-[10rem] h-[10rem] bg-white/50  blur-[7rem] "></div>
    </div>
  );
};

export default Home;
