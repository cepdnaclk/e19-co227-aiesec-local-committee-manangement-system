import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 5000,
});
