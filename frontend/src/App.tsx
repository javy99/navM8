import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthContext } from "./hooks";

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
} from "./pages";

const App = () => {
  const { state } = useAuthContext();
  const { user } = state;

  return (
    <>
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
