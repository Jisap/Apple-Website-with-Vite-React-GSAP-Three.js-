import React from 'react'

const Navbar = () => {
  return (
    <header>
      <nav>
        <img 
          src="logo.svg"
          alt="Logo"
        />

        <ul>
          {[
            {label: "Store"},
            {label: "Mac"},
            {label: "iPhone"}, 
            {label: "Watch"},
            {label: "Vision"},
            {label: "AirPods"},
          ].map(({ label }) => (
            <li key={label}>
              <a href={label}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar