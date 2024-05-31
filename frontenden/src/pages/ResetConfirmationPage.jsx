// import React, { useState } from "react";
// import { Link} from "react-router-dom";
// import LogIn from "../components/LogIn";

// function ResetConfirmationPage() {
//   // TODO GET THE URL PARAM

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // TODO validate token exists

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }
//     // TODO PERFORM FETCH
//   };

//   return (
//     <div className="min-w-xl">
//       {successMessage ? (
//         <>
//           <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
//             Logga in
//           </h2>
//           <div className="mt-2 text-center text-black">
//             {successMessage}
//           </div>
//           <LogIn/>
//         </>
//       ) : (
//         <div className="mt-10">
//           <div className="sm:mx-auto sm:w-full sm:max-w-md">
//             <h2 className="mt-6 text-3xl font-extrabold text-center font-amatic text-gray-900">
//               Set New Password
//             </h2>
//             <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//               <div>
//                 <label htmlFor="password" className="sr-only">
//                   New Password
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   required
//                   className="block w-full px-3 py-2 placeholder-white border bg-transparent border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-emerald-600 focus:border-emerald-800 sm:text-sm"
//                   placeholder="New password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label htmlFor="confirm-password" className="sr-only">
//                   Confirm Password
//                 </label>
//                 <input
//                   id="confirm-password"
//                   name="confirmPassword"
//                   type="password"
//                   required
//                   className="block w-full px-3 py-2 placeholder-white border bg-transparent border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-emerald-600 focus:border-emerald-800 sm:text-sm"
//                   placeholder="Confirm new password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <button
//                   type="submit"
//                   className="flex justify-center w-full px-4 py-2 text-sm font-bold text-white border font-josefin bg-green-800 border-emerald-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800 transition-transform  hover:scale-110 hover:bg-green-800 "
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Resetting..." : "Reset Password"}
//                 </button>
//               </div>
//               {error && (
//                 <div className="mt-2 text-center text-black">{error}</div>
//               )}
//             </form>
//             <div className="flex justify-center">
//               <Link to="/LoginPage" className="py-4 hover:underline font-josefin">
//                 Go to login
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ResetConfirmationPage;