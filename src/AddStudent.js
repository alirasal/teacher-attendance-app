// AddStudent.js
import React, { useState, useEffect } from "react";
import { firestore, collection, addDoc, onSnapshot } from "./firbase";
import Nav from "./Nav";
import "./Addstudent.css";
import CreateClass from "./CreateClass";

const AddStudent = () => {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [classes, setClasses] = useState([]); // State to store the list of classes

  useEffect(() => {
    const classesRef = collection(firestore, "classes");
    const unsubscribe = onSnapshot(classesRef, (querySnapshot) => {
      const classList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClasses(classList);
    });

    return () => unsubscribe();
  }, []);

  const handleClassCreated = (newClass) => {
    setClasses([...classes, newClass]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const studentsRef = collection(firestore, "students");
    const newStudent = {
      name,
      rollNo,
      email,
      className: selectedClass, // Store the selected class name in the student data
    };
  
    try {
      // Add the new student to the Firestore collection
      await addDoc(studentsRef, newStudent);
  
      // Clear the input fields after successful submission
      setName("");
      setRollNo("");
      setEmail("");
      setSelectedClass(""); // Clear the selected class after successful submission
  
      // Show a success alert
      alert("Student added successfully!");
    } catch (error) {
      // Handle any errors that occur during student addition
      console.error("Error adding student:", error);
  
      // Show an error alert
      alert("Error adding student. Please try again later.");
    }
  };
  

  const [selectedClass, setSelectedClass] = useState(""); // State for selected class

  return (
    <div>
      <Nav />
      <CreateClass onClassCreated={handleClassCreated} />
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
        <label>
          Select Class:
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="">Select Class</option>
            {classes.map((classObj) => (
              <option key={classObj.id} value={classObj.name}>
                {classObj.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Add Student</button>
      </form>
      
    </div>
  );
};

export default AddStudent;
