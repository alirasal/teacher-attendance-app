import React, { useEffect, useState } from "react";
import {
  firestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  addDoc,
  arrayUnion, // Add this import
} from "./firbase"; // Make sure to use the correct import path for 'firebase'
import emailjs from "emailjs-com";
import "./studentlist.css";
import Nav from "./Nav";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const subjects= ["Math", "Science", "English", "History"]
  const [times, setTimes] = useState(["10-11", "11-12", "12-1", "1-2"]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const studentsRef = collection(firestore, "students");
    const unsubscribe = onSnapshot(studentsRef, (querySnapshot) => {
      const studentList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
    });

    

    const classesRef = collection(firestore, "classes");
    const unsubscribeClasses = onSnapshot(classesRef, (querySnapshot) => {
      const classesList = querySnapshot.docs.map((doc) => doc.data().name);
      setClasses(classesList);
    });

    return () => {
      unsubscribe();
      unsubscribeClasses();
    };
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleAttendanceChange = (studentId, attendance) => {
    // Find the student in the students state array by ID
    const updatedStudents = students.map((student) =>
      student.id === studentId ? { ...student, attendance } : student
    );
    setStudents(updatedStudents);
  };

  const handleSaveAttendance = async () => {
    if (!selectedSubject || !selectedDate || !selectedTime) {
      alert("Please select a subject, date, and time before saving attendance.");
      return;
    }
  
    try {
      // Create a new collection for each subject if it doesn't exist
      const subjectsRef = collection(firestore, "subjects");
      const subjectDocRef = doc(subjectsRef, selectedSubject);
      const subjectDoc = await getDoc(subjectDocRef);
  
      if (!subjectDoc.exists()) {
        await addDoc(subjectsRef, { subjectName: selectedSubject });
      }
  
      // Now, save the attendance for each student under the corresponding subject collection
      await Promise.all(
        students.map(async (student) => {
          const studentsRef = collection(firestore, "students");
          const studentRef = doc(studentsRef, student.id);
  
          // Check if attendance is marked for the student
          if (!student.attendance || (student.attendance !== "present" && student.attendance !== "absent")) {
            alert(`Attendance not marked for student: ${student.name}`);
            throw new Error(`Attendance not marked for student: ${student.name}`);
          }
  
          try {
            await updateDoc(studentRef, {
              attendance: arrayUnion({
                date: selectedDate,
                time: selectedTime,
                status: student.attendance,
              }),
            });
          } catch (error) {
            console.error("Error updating attendance for student:", student.name, error);
            throw error; // Throw the error to be caught by the outer catch block
          }
        })
      );
  
      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Error saving attendance. Please try again later.");
    }
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
    // Display the alert and get the user's choice
    const shouldDelete = window.confirm("Are you sure you want to delete this student?");
  
    // If the user chooses to delete, proceed with the deletion
    if (shouldDelete) {
      const studentRef = doc(firestore, "students", studentId);
  
      try {
        await deleteDoc(studentRef);
        // Add code here to handle successful deletion, e.g., showing a success message
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    } else {
      // Add code here to handle if the user chooses not to delete, e.g., showing a message or doing nothing
    }
  };
  

  const filteredStudents = students.filter((student) => student.className === selectedClass);
  console.log("Subjects:", subjects);


  return (
    <div>
      <Nav />
      <h2>Student List</h2>
      <div>
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
        <label>
          Select Date:
          <input type="date" value={selectedDate} onChange={handleDateChange} />
        </label>
        
        <button onClick={handleSaveAttendance}>Save</button>
        <button onClick={handleEmailAbsentStudents}>Send Absent Emails</button>
      </div>
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
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.name || ""}</td>
              <td>{student.rollNo || ""}</td>
              <td>{student.email || ""}</td>
              <td>
              <label>
                  <input
                    type="radio"
                    value="present"
                    checked={student.attendance === "present"}
                    onChange={() => handleAttendanceChange(student.id, "present")}
                  />
                  Present
                </label>
                <label>
                  <input
                    type="radio"
                    value="absent"
                    checked={student.attendance === "absent"}
                    onChange={() => handleAttendanceChange(student.id, "absent")}
                  />
                  Absent
                </label>
               
              </td>
              <td>
                <button onClick={() => handleDeleteStudent(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
