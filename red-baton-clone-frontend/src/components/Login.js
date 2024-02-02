import React, { useState } from "react";
import Display from "../assets/display1.webp";
import Logo from "../assets/logoNotes.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const initData = {
    name: "Nikhil",
    email: "Nikhil@gmail.com",
    password: "123",
  };
  const [data, setData] = useState(initData);

  const store = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
  };

  const handleData = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (isLogin) {
        if (data.email && data.password) {
          res = await axios.post("/api/login", {
            email: data.email,
            password: data.password,
          });
        }
      } else {
        if (data.email && data.password && data.name) {
          res = await axios.post("http://localhost:5000/api/signup", {
            email: data.email,
            password: data.password,
            name: data.name,
          });
        }
      }
      if (res.status === 200) {
        store(res.data);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setData(initData);
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-center  max-sm:flex-col">
      <section className="p-10 flex-center flex-col sm:w-1/2 grad sm:me-8 max-sm:mb-4">
        <div className="mb-7 items-center flex-center flex-col">
          <div className="flex justify-center items-center">
            <img
              src={Logo}
              alt="logo"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>

          <p className=" text-center text-3xl my-1">
            Stable Money Notes Making App
          </p>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            {isLogin ? (
              <></>
            ) : (
              <>
                <label htmlFor="name" className="font-bold my-2">
                  Name
                </label>
                {/* <br></br> */}
                <input
                  id="name"
                  type="text"
                  placeholder="Name"
                  required
                  className="border rounded border-black p-1"
                  onChange={handleData}
                  value={data.name || ""}
                ></input>
              </>
            )}

            <label htmlFor="email" className="font-bold my-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="border rounded border-black p-1"
              required
              value={data.email || ""}
              onChange={handleData}
            ></input>

            <label htmlFor="password" className="font-bold my-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="border rounded border-black p-1"
              value={data.password || ""}
              required
              onChange={handleData}
            ></input>

            <button
              className="border rounded font-bold my-2 mt-4 p-2 color-blue text-white"
              type="submit"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
            {isLogin ? (
              <p onClick={() => setIsLogin(false)}>
                New to Stable Money Notes?{" "}
                <span style={{ color: "green" }} className="font-semibold">
                  Sign Up
                </span>
              </p>
            ) : (
              <p onClick={() => setIsLogin(true)}>
                Already a user at Stable Money Notes?{" "}
                <span style={{ color: "green" }} className="font-semibold">
                  Login
                </span>
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
