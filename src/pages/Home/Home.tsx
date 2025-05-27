import { useState, useEffect } from "react";
import { Course } from "@/types/Course";
import { User } from "@/types/User";
import { useNavigate } from "react-router-dom";
import socket from "@/utils/socket";

const Home = () => {
  const navigate = useNavigate();
  let departmentName: string = "";
  let department: string = "";
  const coursemap = new Map([
    ["cs", "Computer Science"],
    ["me", "Mechanical"],
    ["ce", "Civil"],
    ["ec", "Electronics Communication"],
    ["ee", "Electrical Electronics"],
    ["ad", "Artificial Intelligence & Data Science"],
  ]);

  const userinfo: User | null = JSON.parse(localStorage.getItem("userInfo")!);
  console.log(userinfo);
  if (userinfo) {
    department = userinfo.department.toLowerCase();
    departmentName = coursemap.get(department) ?? "";
  }

  const [courses, setCourses] = useState<Course[]>([
    { courseId: "", courseName: "", seatsAvailable: 0 },
  ]);
  const [courseId, setCourseId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [seatsAvailable, setSeatsAvailable] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userinfo) {
      navigate("/");
      return;
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
            body: JSON.stringify({ department: department }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();

        if (data.length === 0) {
          setError("No courses available for this department");
        } else {
          setCourses(data);
          data.forEach((course: Course) => {
            socket.emit("joinCourse", course.courseId);
            console.log(`Joined room for course: ${course.courseId}`);
          });
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please try again.");
      }
    };

    fetchData();

    socket.on(
      "courseUpdated",
      ({ courseId: updatedCourseId, seatsAvailable }) => {
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.courseId === updatedCourseId
              ? { ...course, seatsAvailable }
              : course
          )
        );
        if (updatedCourseId === courseId) {
          setSeatsAvailable(seatsAvailable);
        }
      }
    );

    return () => {
      socket.off("courseUpdated");
      courses.forEach((course) => {
        socket.emit("leaveCourse", course.courseId);
      });
    };
  }, [userinfo, navigate, department, courseId]);

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = courses.find(
      (course) => course.courseName === event.target.value
    );

    if (selected) {
      setSelectedCourse(selected.courseName);
      setSeatsAvailable(selected.seatsAvailable);
      setCourseId(selected.courseId);
      setError(null); // Clear error on course change
    }
  };

  function toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  }

  const toggleLoading = async () => {
    if (selectedCourse === "") {
      setError("Please select a course");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/courses/select`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userinfo?.email,
            courseId: courseId,
          }),
        }
      );

      if (response.status === 412) {
        setError(
          "All seats are filled for this course. Please select another course."
        );
      } else if (!response.ok) {
        throw new Error("Server error. Please try again later.");
      } else {
        const data = await response.json();
        // Update seats with server-provided value
        setSeatsAvailable(data.seatsAvailable);
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.courseId === courseId
              ? { ...course, seatsAvailable: data.seatsAvailable }
              : course
          )
        );
        localStorage.removeItem("userInfo");
        navigate("/registered");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Error selecting course:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-slate-900 text-white flex flex-col items-center justify-evenly md:items-start md:px-5 md:py-5 text-[1.4rem]">
      <div className="absolute blobs top-[10%] w-[10rem] h-[10rem] bg-white/50 blur-[7rem]"></div>
      <div className="w-[90%] md:w-[49%] md:h-[60%] h-fit bg-white/10 backdrop:blur-lg rounded-xl px-5 py-5 md:mb-4 border-b-2 border-t-2 border-gray-500">
        <h2 className="text-[2.2rem] font-bold">Welcome {userinfo?.name}</h2>
        <h3 className="font-medium py-2">Department:</h3>
        <div className="border-2 border-white/50 my-4 rounded-full py-2 flex items-center justify-center">
          <h3 className="text-[1.2rem]">{departmentName}</h3>
        </div>
      </div>
      <div className="w-[90%] h-max md:w-[48%] md:h-[90%] md:absolute right-5 bg-white/10 rounded-xl px-5 py-6 border-b-2 border-t-2 border-gray-500">
        <h2 className="text-[2rem] font-bold">Select course:</h2>
        {error && <p className="text-red-500">{error}</p>}
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
              {toTitleCase(course.courseName)}
            </option>
          ))}
        </select>
        <h3 className="font-medium py-3">Seats Available: {seatsAvailable}</h3>
        <h3 className="font-medium py-3">
          Selected Course: {toTitleCase(selectedCourse)}
        </h3>
      </div>
      <div className="w-[90%] md:w-[49%] h-max md:h-[30%] flex justify-center items-center bg-white/10 rounded-[2rem] py-10 border-t-2 border-b-2 border-gray-500">
        <button
          className={`w-[80%] transition-all cubic duration-300 text-slate-900 bg-white hover:bg-slate-600 focus:text-white hover:text-white focus:bg-slate-600 font-medium rounded-full text-[1.5rem] px-5 py-2.5 text-center flex justify-center items-center ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="button"
          onClick={toggleLoading}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-6 h-6 mr-3 animate-spin"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Loading...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </div>
      <div className="loading absolute blobs bottom-[5%] md:right-1/2 w-[10rem] h-[10rem] bg-white/50 blur-[7rem]"></div>
    </div>
  );
};

export default Home;
