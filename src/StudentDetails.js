import React, { useEffect, useState } from "react";
import { firestore, collection, query, where, onSnapshot } from "./firbase";
import Nav from "./Nav";

function StudentDetails() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    // Fetch classes from Firebase
    const classesRef = collection(firestore, "classes");
    const unsubscribeClasses = onSnapshot(classesRef, (querySnapshot) => {
      const classesList = querySnapshot.docs.map((doc) => doc.data().name);
      setClasses(classesList);
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribeClasses();
    };
  }, []);

  useEffect(() => {
    // Fetch students from Firebase based on selected class
    if (selectedClass) {
      const studentsRef = collection(firestore, "students");
      const classQuery = query(studentsRef, where("className", "==", selectedClass));
      const unsubscribe = onSnapshot(classQuery, (querySnapshot) => {
        const studentList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(studentList);
      });

      // Clean up the listener when the component unmounts or when selectedClass changes
      return () => unsubscribe();
    }
  }, [selectedClass]);

  const calculateAttendancePercentage = (student) => {
    const totalClasses = student.attendance?.length || 0;
    const presentClasses = student.attendance?.filter(
      (attendance) => attendance.status === "present"
    ).length;

    if (totalClasses === 0) {
      return "N/A";
    }

    const percentage = (presentClasses / totalClasses) * 100;
    return percentage.toFixed(2) + "%";
  };

  const calculateTotalClassesAttended = (student) => {
    const totalClasses = student.attendance?.length || 0;
    const totalPresentClasses = student.attendance?.filter(
      (attendance) => attendance.status === "present"
    ).length;
  
    return `${totalPresentClasses} / ${totalClasses}`;
  };
  

  return (
    <div>
      <Nav/>
      <h2>Student Attendance Details</h2>
      <label>
        Select Class:
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">Select Class</option>
          {classes.map((className) => (
            <option key={className} value={className}>
              {className}
            </option>
          ))}
        </select>
      </label>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No.</th>
            <th>Attendance Percentage</th>
            <th>Total Classes Attended</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.rollNo}</td>
              <td>{calculateAttendancePercentage(student)}</td>
              <td>{calculateTotalClassesAttended(student)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentDetails;
