// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import useAuthStore from "../stores/store";

// export default function LogIn() {
//   const navigate = useNavigate();

//   const { setToken, token } = useAuthStore();

//   const [email, setEmail] = useState("");
//   const [emailError, setEmailError] = useState("");

//   const [password, setPassword] = useState("");
//   const [passwordError, setPasswordError] = useState("");

//   const [serverError, setServerError] = useState(""); // New state for server-side errors

//   function validateEmail() {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!regex.test(email)) {
//       setEmailError("It must be a correct email");
//       return false;
//     } else if (!email) {
//       setEmailError("Email is required");
//       return false;
//     } else {
//       setEmailError("");
//       return true;
//     }
//   }

//   function validatePassword() {
//     if (!password) {
//       setPasswordError("Password is required");
//       return false;
//     } else {
//       setPasswordError("");
//       return true;
//     }
//   }

//   async function submitLogin(e) {
//     e.preventDefault();
//     setServerError(""); // Reset server error before each login attempt
//     const isEmailValid = validateEmail();
//     const isPasswordValid = validatePassword();

//     if (isEmailValid && isPasswordValid) {
//       const formData = new FormData();
//       formData.append("username", email); // Use 'username' or 'email' as needed by your backend
//       formData.append("password", password);

//       try {
//         const response = await fetch("http://localhost:8000/user/token", {
//           method: "POST",
//           body: formData,
//         });

//         if (response.status === 200) {
//           const data = await response.json();
//           setToken(data.access_token); // Save the token in the global state
//           console.log(token);
//           navigate("../WeeklyPlanPage");
//           // Handle successful login, e.g., storing the access token
//           console.log(data);
//         } else if (response.status === 400 || response.status === 401) {
//           const data = await response.json();
//           setServerError(data.detail); // Set server error based on the response
//         } else {
//           console.log("Login Failed");
//           setServerError(
//             "An unexpected error occurred. Please try again later."
//           );
//         }
//       } catch (error) {}
//     } else {
//       console.log("Validation errors");
//     }
//   }

//   return (
//     <div className="flex flex-col justify-center">
//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="px-4 py-6 bg-white shadow-xl sm:px-10 border-2 rounded-md border-emerald-800 font-josefin font-medium">
//           <form onSubmit={submitLogin} className="space-y-6" noValidate>
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-semibold text-gray-700"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 onBlur={validateEmail}
//                 className="block w-full px-3 py-2 placeholder-white border bg-transparent border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-emerald-600 focus:border-emerald-800 sm:text-sm"
//               />
//               {emailError && (
//                 <p className="mt-2 text-sm text-black font-semibold">{emailError}</p>
//               )}
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 onBlur={validatePassword}
//                 className="block w-full px-3 py-2 placeholder-white border bg-transparent border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-emerald-600 focus:border-emerald-800 sm:text-sm"
//               />
//               {passwordError && (
//                 <p className="mt-2 text-sm text-black font-semibold">{passwordError}</p>
//               )}
//             </div>
//             <div className="my-2">
//               {serverError && (
//                 <p className="mt-2 text-sm text-black font-semibold">{serverError}</p>
//               )}{" "}
//               {/* Display server-side errors */}
//             </div>
//             <div>
//             <div>
//               <Link
//               to="/PasswordResetPage"
//               type="submit"
//               className=" -mt-4 mb-4 font-semibold hover:underline">
//               Forgot your password?
//               </Link>
//             </div>  
//               <button
//                 type="submit"
//                 className="flex justify-center w-full px-4 py-2 text-sm font-bold text-white border font-josefin bg-green-800 border-emerald-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800 transition-transform  hover:scale-110 hover:bg-green-800  "
//               >Login
//               </button>
//                 <div class="text-center w-full items-center text-sm grid grid-cols-3 mt-5 ">
//                   <hr class="border-t-1  border-gray-400" />
//                   <span>or</span>
//                   <hr class="border-t-1 border-gray-400 " />
//                 </div>
//               <Link 
//                 to="/RegisterPage"
//                 type="submit"
//                 className=" mt-3 flex justify-center w-full px-4 py-2 text-sm font-bold text-black border font-josefin border-emerald-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800 transition-transform  hover:scale-110"
//               >Sign up
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }