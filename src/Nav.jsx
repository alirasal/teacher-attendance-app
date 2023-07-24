import React from 'react'
import './Nav.css'



function Nav() {
  return (
    <div className='main-nav' >
     <div className='nav'>
        <nav className='nav-links'>
          <div>
          <h1 className='link'>links</h1>
          <div>          
           <h4>
            
              <a href="/">Home</a>
            </h4>
           <h4>
              <a href="/add">Add Student</a>
            </h4>
           <h4>
              <a href="/students">Student List</a>
            </h4>
            </div>
            </div>
            

         
        </nav>
      </div>
    </div>
  )
}

export default Nav