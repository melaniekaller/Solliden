import React from "react";
import { Link } from "react-router-dom";
// import PasswordReset from "../components/PasswordReset";

function PasswordResetPage() {
  return (
    <div className="min-w-xl">
      <div className="mt-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900 font-amatic">
            Password Reset
          </h2>
          <div className="flex justify-center max-w-md">
            <PasswordReset/>
          </div>
            <div className="flex justify-center font-josefin">
              <Link to="/Loginpage" className="py-4 hover:underline">
                Go to login
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetPage;