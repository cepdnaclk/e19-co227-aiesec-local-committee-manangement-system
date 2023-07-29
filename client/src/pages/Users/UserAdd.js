import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const FUNCTIONS_URL = "/users/info/func";

export default function UserAdd() {
  // const userRef = useRef();

  const [funcs, setFuncs] = useState([]);

  useEffect(() => {
    loadFuncs();
  }, []);

  const loadFuncs = async (e) => {
    // e.preventDefault();
    try {
      const response = await axios.get(FUNCTIONS_URL);

      console.log(response);

      setFuncs(response.data);
    } catch (err) {
      // TODO: Add better error handling when loading functions
      console.log(err);
    }
  };

  const [formData, setFormData] = useState({
    personalEmail: "",
    userPassword: "",
    fullName: "",
    preferredName: "",
    functionID: "",
    deptID: "",
    dateOfJoin: "",
    positionID: "",
    contactNumber: "",
    aiesecEmail: "",
    gender: "",
    nicNumber: "",
    birthdate: "",
    facebookLink: "",
    linkedInLink: "",
    instagramLink: "",
    facultyID: "",
    batch: "",
    uniRegNo: "",
    schoolName: "",
    homeAddress: "",
    homeContactNumber: "",
    district: "",
    photoLink: "",
    boardingAddress: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData.personalEmail);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* ==================== EMAIL ==================== */}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          // ref={userRef}
          onChange={(e) =>
            setFormData({ ...formData, personalEmail: e.target.value })
          }
          value={formData.personalEmail}
          required
        />
        {/* ==================== PASSWORD ==================== */}
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="text"
          onChange={(e) =>
            setFormData({ ...formData, userPassword: e.target.value })
          }
          value={formData.userPassword}
          required
        />
        {/* ==================== FULL NAME ==================== */}
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          value={formData.fullName}
          required
        />
        {/* ==================== PREF NAME ==================== */}
        <label htmlFor="preferredName">Preferred Name</label>
        <input
          id="preferredName"
          type="text"
          onChange={(e) =>
            setFormData({ ...formData, preferredName: e.target.value })
          }
          value={formData.preferredName}
          required
        />
        {/* ==================== FUNCTION ==================== */}
        <label htmlFor="function">Function</label>
        <select
          id="function"
          onChange={(e) =>
            setFormData({ ...formData, functionID: e.target.value })
          }
          value={formData.functionID}
          required
        >
          {funcs.map((func, index) => (
            <option value={func.id}>{func.name}</option>
          ))}
        </select>
        {/* ==================== DEPT ==================== */}
        {/* ==================== DATE OF JOIN ==================== */}
        {/* ==================== POSITION ==================== */}
        {/* ==================== CONTACT ==================== */}
        {/* ==================== AIESEC EMAIL ==================== */}
        {/* ==================== GENDER ==================== */}
        {/* ==================== NIC ==================== */}
        {/* ==================== DOB ==================== */}
        {/* ==================== FACEBOOK ==================== */}
        {/* ==================== LINKEDIN ==================== */}
        {/* ==================== INSTAGRAM ==================== */}
        {/* ==================== FACULTY ==================== */}
        {/* ==================== BATCH ==================== */}
        {/* ==================== REGNO ==================== */}
        {/* ==================== SCHOOL NAME ==================== */}
        {/* ==================== ADDRESS ==================== */}
        {/* ==================== HOME CONTACT ==================== */}
        {/* ==================== DISTRICT ==================== */}
        {/* ==================== PHOTO LINK ==================== */}
        {/* ==================== BOARDED ADDRESS ==================== */}
        <button type="submit">Create</button>
      </form>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </>
  );
}
