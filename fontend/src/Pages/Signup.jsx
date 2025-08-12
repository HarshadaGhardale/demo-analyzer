import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const isPasswordValid = (password) => {
    const minLength = 6;
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasNumber && hasSymbol;
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      setMsg("Please fill all fields");
      return;
    }

    if (!isPasswordValid(password)) {
      setMsg("Password must include a symbol, a number, and be 6+ characters");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/user/signup", {
        email,
        password,
      });

      if (res.status === 201) {
        alert("Signup successful");
        navigate("/login");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        setMsg(err.response.data.msg);
      } else {
        setMsg("Something went wrong. Please try again.");
      }
    }
  };

  const handleGoogleSignup = () => {
    alert("In a real application, this would redirect to Google for authentication.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-gray-300 flex items-center justify-center px-4 font-inter">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl border border-gray-200 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
        <h2 className="text-3xl font-bold text-center text-black mb-2 animate-fade-in">
          ✨ Create Account
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Start your journey with <span className="font-semibold">Sprush</span> today.
        </p>

        {msg && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4 text-sm transition-opacity duration-300">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleInput}
            placeholder="Enter email"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black transition duration-300"
          />
          <div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleInput}
              placeholder="Create password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black transition duration-300"
            />
            <p className="text-xs text-gray-500 mt-1 ml-1">
              Must include a symbol, a number, and be 6+ characters long
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 font-semibold transition-transform duration-300 hover:scale-[1.02]"
          >
            Signup
          </button>
        </form>

        <button
          onClick={handleGoogleSignup}
          className="w-full mt-4 py-3 bg-white border border-gray-300 text-black rounded-md hover:bg-gray-100 font-medium transition-transform duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
          <span>Sign up with Google</span>
        </button>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="underline hover:text-black font-medium transition-colors duration-300"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;