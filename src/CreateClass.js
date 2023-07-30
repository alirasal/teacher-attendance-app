import React, { useState } from "react";
import { firestore, collection, addDoc } from "./firbase";

const CreateClass = ({ onClassCreated }) => {
  const [className, setClassName] = useState("");

  const handleCreateClass = async () => {
    if (className.trim() === "") return;

    const classesRef = collection(firestore, "classes");
    const newClass = {
      name: className.trim(),
      students: [], // Initially, the class has no students
    };
    await addDoc(classesRef, newClass);

    // Clear the input field and notify the parent component (AddStudent.js)
    setClassName("");
    onClassCreated(newClass);
  };

  return (
    <div>
      <input
        type="text"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        placeholder="Enter Class Name"
      />
      <button onClick={handleCreateClass}>Create Class</button>
    </div>
  );
};

export default CreateClass;
