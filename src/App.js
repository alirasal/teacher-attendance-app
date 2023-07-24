import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // Updated import

import AddStudent from "./AddStudent";
import StudentList from "./StudentList";
import Home from "./Home";

const App = () => {
  return (
    <Router>
      
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<Home/>} />
        <Route path="/add" element={<AddStudent />} />
        <Route path="/students" element={<StudentList />} />
      </Routes>
    </Router>
  );
};

export default App;
