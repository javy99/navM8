import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import {
  Profile,
  Messages,
  MyBookings,
  Favorites,
  MyTours,
  About,
  HomePage,
  Signup,
  Login,
  TourDetails,
} from './pages'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Messages />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/mytours" element={<MyTours />} />
          <Route path="/:id" element={<TourDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
