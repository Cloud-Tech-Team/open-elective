import { useState } from "react";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({  
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <form
      className="flex flex-col gap-2 w-[80%]"
      onSubmit={(e) => {
        e.preventDefault();
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
    >
      <input
        type="text"
        name="name" // Add name attribute
        required
        placeholder="Student Name ( Advaith Narayanan )"
        value={user.name}
        onChange={handleInputChange} // Bind onChange
        className="cubic-1 drop-shadow input p-2 bg-transparent border-b-2 border-white text-white hover:placeholder:text-dark-offset rounded placeholder:text-white/80"
      />
      <input
        type="email"
        name="email" // Add name attribute
        required
        placeholder="College Email ID ( 21CS051@mgits.ac.in )"
        value={user.email}
        onChange={handleInputChange} // Bind onChange
        className="cubic-1 drop-shadow input p-2 bg-transparent border-b-2 border-white text-white hover:placeholder:text-dark-offset rounded placeholder:text-white/80"
      />
      <input
        type="text"
        name="registerId" // Add name attribute
        required
        placeholder="Register No ( MUT21CS051 )"
        value={user.registerId}
        onChange={handleInputChange} // Bind onChange
        className="cubic-1 drop-shadow input p-2 bg-transparent border-b-2 border-white text-white hover:placeholder:text-dark-offset rounded placeholder:text-white/80"
      />
      <button className="p-2 font-bold text-[1.4rem] bg-white rounded text-dark-offset mt-[2em]">
        Next
      </button>
    </form>
  );
}

export default Form;
