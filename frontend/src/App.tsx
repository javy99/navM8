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
import { PrivateRoute } from './components'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/profile"
            element={<PrivateRoute component={Profile} />}
          />
          <Route path="/chat" element={<PrivateRoute component={Messages} />} />
          <Route
            path="/bookings"
            element={<PrivateRoute component={MyBookings} />}
          />
          <Route
            path="/favorites"
            element={<PrivateRoute component={Favorites} />}
          />
          <Route
            path="/mytours"
            element={<PrivateRoute component={MyTours} />}
          />
          <Route
            path="/:id"
            element={<PrivateRoute component={TourDetails} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
