import React from 'react'
import './Nav.css'
import { useNavigate } from 'react-router-dom'



function Nav() {
  const navigate = useNavigate()

  const addnav=(e)=>{
    e.preventDefault();
    navigate('/add')
   }
  const homenav=(e)=>{
    e.preventDefault();
    navigate('/')
   }
  const studentListnav=(e)=>{
    e.preventDefault();
    navigate('/students')
   }
  const studentDetailsnav=(e)=>{
    e.preventDefault();
    navigate('/studentDetails')
   }


  return (
    <div className='navContainer'>
     <div className='nav'>
        <nav className='nav-links'>
          <div>
          <h1 className='link'>links</h1>
          <div>          
           <h4>
            
              <a onClick={homenav}>Home</a>
            </h4>
           <h4>
              <a onClick={addnav}>Add Student</a>
            </h4>
           <h4>
              <a onClick={studentListnav}>Student List</a>
            </h4>
           <h4>
              <a onClick={studentDetailsnav}>Student Details</a>
            </h4>
            </div>
            </div>
            

         
        </nav>
      </div>
    </div>
  )
}

export default Nav