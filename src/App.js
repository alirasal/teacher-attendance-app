import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // Updated import

import AddStudent from "./AddStudent";
import StudentList from "./StudentList";
import Home from "./Home";
import StudentDetails from "./StudentDetails";

const App = () => {
  return (
    <Router>
      
      <Routes> 
        <Route path="/" element={<Home/>} />
        <Route path="/add" element={<AddStudent />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/studentDetails" element={<StudentDetails
         />} />

      </Routes>
    </Router>
  );
};

export default App;
