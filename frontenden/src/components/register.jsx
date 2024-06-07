import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState([]);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState([]);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState([]);
  const [terms, setTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

  function validateFirstName() {
    let errors = [];
    if (!firstName) {
      errors.push("Förnamn krävs");
    }
    setFirstNameError(errors);
  }
  function validateLastName() {
    let errors = [];
    if (!lastName) {
      errors.push("Efternamn krävs");
    }
    setLastNameError(errors);
  }
  function validateEmail() {
    let emailErrors = [];
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      emailErrors.push("Det måste vara en korrekt e-postadress");
    }
    if (!email) {
      emailErrors.push("E-postadress är nödvändigt");
    }
    setEmailError(emailErrors);
  }
  function validatePassword() {
    let passwordErrors = [];
    const regex = /[^a-zA-Z0-9]/;
    if (password.length <= 8) {
      passwordErrors.push("Lösenordet måste vara längre än 8 tecken");
    }
    if (!regex.test(password)) {
      passwordErrors.push("Lösenordet måste innehålla ett unikt tecken");
    }
    if (!password) {
      passwordErrors.push("Lösenord krävs");
    }
    setPasswordError(passwordErrors);
  }
  function validateTerms() {
    if (!terms) {
      setTermsError("Nödvändigt!");
    } else {
      setTermsError("");
    }
  }

  const handleTermsLink = () => {
    // Serialize and save current form data to sessionStorage
    const dataToSave = JSON.stringify({ email, password, firstName, lastName, terms });
    sessionStorage.setItem('formData', dataToSave);
    navigate('/Villkor');
  };

  // Checkbox change handler to toggle the terms agreement state
  const handleCheckboxChange = (event) => {
    setTerms(event.target.checked);
  };

  // Effect to load the terms acceptance state from sessionStorage
  useEffect(() => {
    console.log("Component mounted, checking for termsAccepted in sessionStorage");
    const termsAccepted = sessionStorage.getItem('termsAccepted');
    console.log("Terms accepted from storage:", termsAccepted);
    if (termsAccepted === 'true') {
        setTerms(true);
        console.log("Terms state updated to true");
    }
    return () => {
        console.log("Cleaning up termsAccepted");
        sessionStorage.removeItem('termsAccepted');
    };
  }, []);

  // Effect to restore form data from sessionStorage
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('formData');
    if (savedFormData) {
        const { email, password, firstName, lastName, terms } = JSON.parse(savedFormData);
        setEmail(email);
        setPassword(password);
        setFirstName(firstName);
        setLastName(lastName);
        setTerms(terms);
    }
  }, []);

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (validateForm()) {
          try {
              const response = await fetch("http://localhost:8000/user/create", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, firstname: firstName, lastname: lastName, password })
              });
              const data = await response.json();
              if (response.status === 201) {
                  console.log("Success");
                  navigate("/LoginPage");
              } else {
                  console.log("Något gick fel", data);
              }
          } catch (error) {
              console.log("Server Error", error);
          }
      } else {
          console.log("Error i formuläret");
      }
  };

  return (
    <>
      <div className="flex flex-col justify-center overflow-y-auto flex-1 min-h-full px-6 py-12 lg:px-8">
        <div className="mt-8 sm:mx-auto w-2/5">
          <div className="px-4 py-6 bg-white shadow-xl sm:px-10 border-2 rounded-md border-emerald-800 font-Lora font-medium ">
            <h2 className="text-3xl text-center mb-6 text-black">Registrera ett konto</h2>
            <form className="space-y-6 flex flex-col" onSubmit={handleSubmit}>
              <div className="flex gap-4 justify-around">
                  <div className="w-full">
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Förnamn
                    </label>
                    <div className="mt-1">
                      <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        autoComplete="given-name"
                        required
                        className="block w-full px-3 py-2 placeholder-white border bg-transparent border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-emerald-600 focus:border-emerald-800 sm:text-sm"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onBlur={validateFirstName}
                      />
                      {firstNameError.map((error, index) => (
                        <p key={index} className="mt-1 text-xs text-black">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Efternamn
                    </label>
                    <div className="mt-1">
                      <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        autoComplete="family-name"
                        required
                        className="block w-full px-3 py-2 placeholder-white border bg-transparent border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-emerald-600 focus:border-emerald-800 sm:text-sm"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onBlur={validateLastName}
                      />
                      {lastNameError.map((error, index) => (
                        <p key={index} className="mt-1 text-xs text-black">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
              </div>

              <div className="flex gap-4 justify-around">
                  <div className="w-full">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      E-post
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full px-3 py-2 placeholder-white border bg-transparent border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-emerald-600 focus:border-emerald-800 sm:text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={validateEmail}
                      />
                      {emailError.map((error, index) => (
                        <p key={index} className="mt-1 text-xs text-black">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Lösenord
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full px-3 py-2 placeholder-white border bg-transparent border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-emerald-600 focus:border-emerald-800 sm:text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={validatePassword}
                      />
                      {passwordError.map((error, index) => (
                        <p key={index} className="mt-1 text-xs text-black">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
              </div>

              <div className="flex items-center pt-4">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="w-4 h-4 -mb-2 border-gray-300 rounded"
                  checked={terms}
                  // onChange={(e) => setTerms(e.target.checked)}
                  onChange={handleCheckboxChange}
                  onBlur={validateTerms}
                />
                <label
                  htmlFor="terms"
                  className="block text-sm ml-2 -mb-2 text-gray-900"
                >
                   Jag godkänner <Link to="/Villkor" onClick={handleTermsLink} className="hover:underline">villkoren och bestämmelserna</Link>
                </label>
                {termsError && (
                  <p className="ml-6 -mb-2 text-xs text-black">{termsError}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="flex justify-center w-full px-4 py-2 text-sm font-bold text-white border font-Lora bg-green-800 border-emerald-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800 transition-transform  hover:scale-110 hover:bg-green-800 "
                >
                  Registrera konto
                </button>
                <div className="text-center w-full items-center text-sm grid grid-cols-3 mt-5 ">
                  <hr className="border-t-1  border-gray-400" />
                  <span>eller</span>
                  <hr className="border-t-1 border-gray-400 " />
                </div>
                <Link
                  to="/LoginPage"
                  type="submit"
                  className=" mt-3 flex justify-center w-full px-4 py-2 text-sm font-bold text-black border font-Lora border-emerald-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800 transition-transform  hover:scale-110"
                >
                  Logga in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
