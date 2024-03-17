import React from "react";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import { useAuthContext } from "./hooks/useAuthContext";

import {
  Profile,
  Messages,
  MyBookings,
  Favorites,
  MyTours,
  About,
} from "./pages";

import { GlobalStyles } from "./components";

const App = () => {
  const { state } = useAuthContext();
  const { user } = state;

  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/mytours" element={<MyTours />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
