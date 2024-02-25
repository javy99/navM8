import React from "react";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import { useAuthContext } from "./hooks/useAuthContext";

const App = () => {
  const { state } = useAuthContext();
  const { user } = state;

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route
          path="/"
          element={user ? <HomePage user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        /> */}

        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} /> 

        {/* <Route path="/profile" element={<Profile />} /> */}
        {/* <Route path="/messages" element={<Messages />} />*/}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
