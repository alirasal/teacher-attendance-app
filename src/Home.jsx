import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'
import Nav from './Nav'

function Home() {
  return (
    <div>
       <Nav/>
        <h1>Welcome to the Student Attendance App</h1>
    </div>
  )
}

export default Home