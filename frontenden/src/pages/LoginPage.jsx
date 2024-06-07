import React from "react";
import { Link } from "react-router-dom";
import LogIn from "../components/login";

function LoginPage() {

  return (
    <>
      <div className="min-w-xl -mt-2 font-Lora">
        <div className="mt-32 relative">
          <LogIn />
        </div>
      </div>
    </>
  );
}

export default LoginPage;