import React, { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate fetching user data
    setUser({
      name: "Jane Doe",
      email: "jane@example.com",
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/auth" element={<AuthPage />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        {/* <Route path="/messages" element={<Messages />} /> */}


      </Routes>
    </Router>
  );
};

export default App;
