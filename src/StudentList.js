import React, { useEffect, useState } from "react";
import { firestore, collection, onSnapshot, doc, updateDoc, deleteDoc } from "./firbase";
import emailjs from "emailjs-com";
import './studentlist.css'
import Nav from './Nav'

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const studentsRef = collection(firestore, "students");
    const unsubscribe = onSnapshot(studentsRef, (querySnapshot) => {
      const studentList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleAttendanceChange = async (studentId, attendance) => {
    const studentRef = doc(firestore, "students", studentId);

    try {
      await updateDoc(studentRef, { attendance });
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const handleSaveAttendance = () => {
    // Implement the logic to save the attendance changes in Firestore
    students.forEach((student) => {
      const studentRef = doc(firestore, "students", student.id);
      updateDoc(studentRef, { attendance: student.attendance });
    });
  };

  const handleEmailAbsentStudents = () => {
    // Send emails to absent students using EmailJS
    const absentStudents = students.filter((student) => student.attendance === "absent");

    if (absentStudents.length === 0) {
      alert("No absent students to send emails.");
      return;
    }

    // Replace with your EmailJS template and service IDs
    const templateId = "template_e6mebuj";
    const serviceId = "service_omiquml";
    const userId = "MP4HcuhzJUhXMp-_t";

    // Send email to each absent student
    absentStudents.forEach((student) => {
      const emailParams = {
        to_email: student.email,
        from_name: "Your Teacher",
        subject: "Attendance Notification",
        message: `Dear ${student.name},\nYou were marked as absent in today's class.`,
      };

      emailjs.send(serviceId, templateId, emailParams, userId).then(
        (response) => {
          console.log("Email sent successfully:", response.text);
        },
        (error) => {
          console.error("Failed to send email:", error);
        }
      );
    });

    alert("Emails sent to absent students.");
  };
  const handleDeleteStudent = async (studentId) => {
    const studentRef = doc(firestore, "students", studentId);

    try {
      await deleteDoc(studentRef);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div>
      <Nav/>
      <h2>Student List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Email</th>
            <th>Attendance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.rollNo}</td>
              <td>{student.email}</td>
              <td>
                <label>
                  <input
                    type="radio"
                    value="absent"
                    checked={student.attendance === "absent"}
                    onChange={() => handleAttendanceChange(student.id, "absent")}
                  />
                  Absent
                </label>
                <label>
                  <input
                    type="radio"
                    value="present"
                    checked={student.attendance === "present"}
                    onChange={() => handleAttendanceChange(student.id, "present")}
                  />
                  Present
                </label>
              </td>
              <td>
                <button onClick={() => handleDeleteStudent(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSaveAttendance}>Save</button>
      <button onClick={handleEmailAbsentStudents}>Send Absent Emails</button>
    </div>
  );
};

export default StudentList;
