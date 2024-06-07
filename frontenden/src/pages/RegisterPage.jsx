import React from "react";
import { Link } from "react-router-dom";
import Register from "../components/register";

function RegisterPage() {
  return (
    <div className="min-w-xl">
      <div className="mt-6">
        <Register/>
      </div>
    </div>
  );
}

export default RegisterPage;
