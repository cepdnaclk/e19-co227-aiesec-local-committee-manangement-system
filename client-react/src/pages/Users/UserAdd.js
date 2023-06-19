import React, { useState, useRef } from "react";

export default function UserAdd() {
  const userRef = useRef();

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
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        ref={userRef}
        onChange={(e) =>
          setFormData({ ...formData, personalEmail: e.target.value })
        }
        value={formData.personalEmail}
        required
      />
      <button type="submit">Create</button>
    </form>
  );
}
