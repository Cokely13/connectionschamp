import React from 'react'


import Routes from './Routes'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div>
      <Navbar />
      <div className="content-container">
        <Routes />
      </div>
    </div>
  )
}

export default App
