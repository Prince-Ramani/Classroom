import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Signup from "./customComponents/Signup/Signup";
import Signin from "./customComponents/Signin/Signin";
import { useQuery } from "@tanstack/react-query";
import { useAuthUser } from "./Context/authUserContext";
import CreateClass from "./customComponents/CreateClass/CreateClass";
import { useState } from "react";
import Home from "./customComponents/Home/Home";

const App = () => {
  const { setAuthUser } = useAuthUser();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isPending } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/getme");
      const data = await res.json();

      if ("_id" in data) {
        setAuthUser(data);
        setIsLoggedIn(true);
      }

      return data;
    },
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/signup"
          element={!isLoggedIn ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/signin"
          element={!isLoggedIn ? <Signin /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/signup" />}
        />
        <Route
          path="/createclass"
          element={isLoggedIn ? <CreateClass /> : <Navigate to="/signup" />}
        />
        <Route
          path="*"
          element={isLoggedIn ? <Home /> : <Navigate to="/signup" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
