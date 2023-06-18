import React, { useState, useEffect, useRef, useContext } from "react";
import AuthContext from "../../context/AuthProvider";

import axios from "../../api/axios";
const LOGIN_URL = "/login";

export default function Login() {
  const { setAuth } = useContext(AuthContext);

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  //   function isValidEmail(email) {
  //     return /\S+@\S+\.\S+/.test(email);
  //   }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // // prevent form submission if email is invalid
    // if (!isValidEmail(email)) {
    //   setErrMsg("Invalid Email");
    //   errRef.current.focus();
    //   return;
    // }

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          //   withCredentials: true,
        }
      );
      console.log(JSON.stringify(response.data));

      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ email, password, roles, accessToken });
      setEmail("");
      setPassword("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 404) {
        setErrMsg("Missing User");
      } else if (err.response?.status === 401) {
        setErrMsg("Password Mismatch");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <p ref={errRef}>{errMsg}</p>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          ref={userRef}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          ref={userRef}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
