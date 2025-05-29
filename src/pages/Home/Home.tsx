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
    ["ai", "Computer Science & Artificial Intelligence"],
    ["ad", "Artificial Intelligence & Data Science"],
    ["cy", "Cyber Security"],
  ]);

  const userinfo: User | null = JSON.parse(localStorage.getItem("userInfo")!);
  if (userinfo) {
    department = userinfo.department.toLowerCase();
    departmentName = coursemap.get(department) ?? "";
  }  const [courses, setCourses] = useState<Course[]>([
    { courseId: "", courseName: "", seatsAvailable: 0 },
  ]);
  const [courseId, setCourseId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [seatsAvailable, setSeatsAvailable] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isFormAllowed, setIsFormAllowed] = useState<boolean | null>(null);  useEffect(() => {
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
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please try again.");
      }
    };

    fetchData();
  }, [userinfo, navigate, department]);

  // Check if form is allowed
  useEffect(() => {
    const checkFormAllowed = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_URL}/allowed`);
        if (response.ok) {
          const data = await response.json();
          setIsFormAllowed(data.allowed); // Extract the 'allowed' property
        } else {
          console.error("Failed to check form status");
          setIsFormAllowed(false);
        }
      } catch (error) {
        console.error("Error checking form status:", error);
        setIsFormAllowed(false);
      }
    };

    checkFormAllowed();
  }, []);

  // Handle socket connection status
  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      console.log('Connected to server');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Set initial connection status
    setIsConnected(socket.connected);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  // Separate useEffect for socket events to avoid dependency issues
  useEffect(() => {
    if (courses.length === 0 || courses[0].courseId === "") {
      return;
    }

    // Join course rooms for real-time updates
    courses.forEach((course: Course) => {
      socket.emit("joinCourse", course.courseId);
      // console.log(`Joined room for course: ${course.courseId}`);
    });

    // Set up real-time event listeners
    const handleCourseUpdated = ({ courseId: updatedCourseId, seatsAvailable }: { courseId: string; seatsAvailable: number }) => {
      // console.log(`Course updated: ${updatedCourseId}, seats: ${seatsAvailable}`);
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.courseId === updatedCourseId
            ? { ...course, seatsAvailable }
            : course
        )
      );
      // Update the selected course seats if it matches
      if (updatedCourseId === courseId) {
        setSeatsAvailable(seatsAvailable);
      }
    };

    const handleCourseStatisticsUpdate = ({ courses: courseStats }: { courses: Array<{courseCode: string; seatsAvailable: number; enrolledCount: number; totalCapacity: number; enrollmentPercentage: string}> }) => {
      // console.log('Course statistics updated:', courseStats);
      // Update course data with the latest statistics
      setCourses((prevCourses) =>
        prevCourses.map((course) => {
          const updatedCourse = courseStats.find(stat => stat.courseCode === course.courseId);
          if (updatedCourse) {
            return { ...course, seatsAvailable: updatedCourse.seatsAvailable };
          }
          return course;
        })
      );
    };

    const handleCourseCountUpdate = ({ totalCourses }: { totalCourses: number }) => {
      console.log('Total courses updated:', totalCourses);
      // You can use this for displaying total course count if needed
    };

    // Add event listeners
    socket.on("courseUpdated", handleCourseUpdated);
    socket.on("courseStatisticsUpdate", handleCourseStatisticsUpdate);
    socket.on("courseCountUpdate", handleCourseCountUpdate);

    // Request initial course statistics
    socket.emit("requestCourseStatistics");

    // Cleanup function
    return () => {
      socket.off("courseUpdated", handleCourseUpdated);
      socket.off("courseStatisticsUpdate", handleCourseStatisticsUpdate);
      socket.off("courseCountUpdate", handleCourseCountUpdate);
      
      // Leave course rooms
      courses.forEach((course) => {
        socket.emit("leaveCourse", course.courseId);
      });
    };
  }, [courses, courseId]);

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
  }  const toggleLoading = async () => {
    if (!isFormAllowed) {
      setError("Course selection is currently not allowed");
      return;
    }

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
        
        // Emit course update for real-time sync (if the server supports it)
        socket.emit("courseSelected", {
          courseId: courseId,
          seatsAvailable: data.seatsAvailable,
          userEmail: userinfo?.email
        });
        
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
      </div>      <div className="w-[90%] h-max md:w-[48%] md:h-[90%] md:absolute right-5 bg-white/10 rounded-xl px-5 py-6 border-b-2 border-t-2 border-gray-500">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[2rem] font-bold">Select course:</h2>
          <div className="flex flex-col items-end gap-1">
            <div className={`flex items-center gap-2 text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              {isConnected ? 'Live' : 'Offline'}
            </div>
            <div className={`flex items-center gap-2 text-xs ${
              isFormAllowed === null ? 'text-yellow-400' : 
              isFormAllowed ? 'text-green-400' : 'text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isFormAllowed === null ? 'bg-yellow-400' : 
                isFormAllowed ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              {isFormAllowed === null ? 'Checking...' : 
               isFormAllowed ? 'Open' : 'Closed'}
            </div>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}<select
          value={selectedCourse}
          onChange={handleCourseChange}
          className="course-selection-form w-[100%] bg-transparent border-2 border-white/50 py-3 px-6 rounded-full my-5"
          required
          disabled={!isFormAllowed}
        >
          <option value="" disabled>
            {isFormAllowed === null ? "Loading..." : isFormAllowed ? "Select a course" : "Course selection is disabled"}
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
      <div className="w-[90%] md:w-[49%] h-max md:h-[30%] flex justify-center items-center bg-white/10 rounded-[2rem] py-10 border-t-2 border-b-2 border-gray-500">        <button
          className={`w-[80%] transition-all cubic duration-300 text-slate-900 bg-white hover:bg-slate-600 focus:text-white hover:text-white focus:bg-slate-600 font-medium rounded-full text-[1.5rem] px-5 py-2.5 text-center flex justify-center items-center ${
            isLoading || !isFormAllowed ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="button"
          onClick={toggleLoading}
          disabled={isLoading || !isFormAllowed}
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
          ) : !isFormAllowed ? (
            "Course Selection Disabled"
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
