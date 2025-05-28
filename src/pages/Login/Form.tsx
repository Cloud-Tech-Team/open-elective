import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/User";

function Form() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    registerId: "",
    department: "",
    optedCourses: null,
  });
  const [isRegistrationAllowed, setIsRegistrationAllowed] = useState<boolean | null>(null);
  const [isCheckingAllowed, setIsCheckingAllowed] = useState<boolean>(true);

  // Check if registration is allowed
  useEffect(() => {
    const checkRegistrationAllowed = async () => {
      try {
        setIsCheckingAllowed(true);
        const response = await fetch(`${import.meta.env.VITE_URL}/allowed`);
        if (response.ok) {
          const data = await response.json();
          setIsRegistrationAllowed(data.allowed);
        } else {
          console.error('Failed to check registration status');
          setIsRegistrationAllowed(false);
        }
      } catch (error) {
        console.error('Error checking registration status:', error);
        setIsRegistrationAllowed(false);
      } finally {
        setIsCheckingAllowed(false);
      }
    };

    checkRegistrationAllowed();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({  
      ...prevUser,
      [name]: value,
    }));
  };
  return (
    <div className="flex flex-col gap-4 w-[80%]">
      {/* Registration Status Indicator */}
      <div className="flex items-center justify-center gap-2 mb-2">
        {isCheckingAllowed ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-yellow-400 text-sm">Checking registration status...</span>
          </div>
        ) : isRegistrationAllowed ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-green-400 text-sm">Registration Open</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-red-400 text-sm">Registration Closed</span>
          </div>
        )}
      </div>

      {/* Show message when registration is closed */}
      {!isCheckingAllowed && !isRegistrationAllowed && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
          <p className="text-red-300 text-center">
            Registration is currently disabled. Please try again later.
          </p>
        </div>
      )}

      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();

          // Prevent submission if registration is not allowed
          if (!isRegistrationAllowed) {
            alert("Registration is currently disabled. Please try again later.");
            return;
          }

          const emailRegex = /^\d\d\w\w\d\d\d@mgits\.ac\.in$/;
          if (!emailRegex.test(user.email)) {
            alert("Please enter a valid college email id");
            return;
          }
          user.department = user.email?.slice(2, 4).toUpperCase() ?? "";
          if (user.department === "CT"){
            user.department = "AD"
          }
          fetch(`${import.meta.env.VITE_URL}/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              registerId: user.registerId,
              department: user.department,
              optedCourses: null,
            }),
          }).then((response) => {
            if (response.status === 412){
              alert("User already registered");
              return;
            }
            if (response.status != 200 ){
              alert("Server error, please try again later");
              return;
            }
            localStorage.setItem("userInfo", JSON.stringify(user));
            setUser({ name: "", email: "", registerId: "",department:"", optedCourses: null});
            navigate("/home");
          })
        }}
      >        <input
          type="text"
          name="name"
          required
          placeholder="Student Name ( Jhon Doe )"
          value={user.name}
          onChange={handleInputChange}
          disabled={!isRegistrationAllowed || isCheckingAllowed}
          className={`cubic-1 drop-shadow input p-2 bg-transparent border-b-2 text-white hover:placeholder:text-dark-offset rounded placeholder:text-white/80 ${
            !isRegistrationAllowed || isCheckingAllowed 
              ? 'border-gray-500 text-gray-400 cursor-not-allowed' 
              : 'border-white'
          }`}
        />
        <input
          type="email"
          name="email"
          required
          placeholder="College Email ID ( 20me007@mgits.ac.in )"
          value={user.email}
          onChange={handleInputChange}
          disabled={!isRegistrationAllowed || isCheckingAllowed}
          className={`cubic-1 drop-shadow input p-2 bg-transparent border-b-2 text-white hover:placeholder:text-dark-offset rounded placeholder:text-white/80 ${
            !isRegistrationAllowed || isCheckingAllowed 
              ? 'border-gray-500 text-gray-400 cursor-not-allowed' 
              : 'border-white'
          }`}
        />
        <input
          type="text"
          name="registerId"
          required
          placeholder="Register No ( MUT20ME420 )"
          value={user.registerId}
          onChange={handleInputChange}
          disabled={!isRegistrationAllowed || isCheckingAllowed}
          className={`cubic-1 drop-shadow input p-2 bg-transparent border-b-2 text-white hover:placeholder:text-dark-offset rounded placeholder:text-white/80 ${
            !isRegistrationAllowed || isCheckingAllowed 
              ? 'border-gray-500 text-gray-400 cursor-not-allowed' 
              : 'border-white'
          }`}
        />
        <button 
          type="submit"
          disabled={!isRegistrationAllowed || isCheckingAllowed}
          className={`p-2 font-bold text-[1.4rem] rounded mt-[2em] transition-all duration-200 ${
            !isRegistrationAllowed || isCheckingAllowed 
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
              : 'bg-white text-dark-offset hover:bg-gray-100'
          }`}
        >
          {isCheckingAllowed ? 'Checking...' : isRegistrationAllowed ? 'Next' : 'Registration Closed'}
        </button>
      </form>
    </div>  );
}

export default Form;
