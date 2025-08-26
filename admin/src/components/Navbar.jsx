// import React from 'react'
import "./navbar.css"
import navlogo from "../assets/logo.svg"

export default function Navbar() {
  return (
    <div className='navbar'>
      <div className='logo-container'>
        <img src={navlogo} alt="logo" className="nav-logo" />
        <p>StyleHub</p>
      </div>
    </div>
  )
}
