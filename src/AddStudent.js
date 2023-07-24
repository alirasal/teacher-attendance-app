// AddStudent.js
import React, { useState } from "react";
import {firestore, collection, addDoc } from "./firbase";
import Nav from './Nav'
import './Addstudent.css'


const AddStudent = () => {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentsRef = collection(firestore, "students");
    const newStudent = {
      name,
      rollNo,
      email,
    };
    await addDoc(studentsRef, newStudent);

    // Clear the input fields after submitting
    setName("");
    setRollNo("");
    setEmail("");
  };

  return (
    <div>
    <Nav/>

    <form onSubmit={handleSubmit} className="add-form">
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Roll No:
        <input type="text" value={rollNo} onChange={(e) => setRollNo(e.target.value)} required />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <button type="submit">Add Student</button>
    </form>
    </div>
  );
};

export default AddStudent;
