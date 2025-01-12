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
import Home from "./customComponents/Home/Home";
import ClassLayout from "./customComponents/Class/Layout.tsx/ClassLayout";
import Stream from "./customComponents/Class/Stream";
import Classwork from "./customComponents/Class/Classwork";
import People from "./customComponents/Class/People/People";
import FullMessage from "./customComponents/FullMessage/FullMessage";
import Settings from "./customComponents/FullMessage/Settings";
import Loading from "./components/Loading";

const App = () => {
  const { setAuthUser } = useAuthUser();

  const { isPending, data } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/getme");
      const data = await res.json();

      if ("_id" in data) setAuthUser(data);

      return data;
    },
    retry: false,
  });

  const isLoggedIn = data && !data.error;

  if (isPending) {
    return (
      <div className="h-screen flex justify-center items-center ">
        <Loading />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/signup"
          element={!isLoggedIn ? <Signup /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signin"
          element={!isLoggedIn ? <Signin /> : <Navigate to="/" replace />}
        />
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/signup" />}
        />
        <Route
          path="/createclass"
          element={isLoggedIn ? <CreateClass /> : <Navigate to="/signup" />}
        />
        <Route path="/class/:classID" element={<ClassLayout />}>
          <Route
            index
            element={isLoggedIn ? <Stream /> : <Navigate to="/signup" />}
          />
          <Route
            path="classwork"
            element={isLoggedIn ? <Classwork /> : <Navigate to="/signup" />}
          />
          <Route
            path="people"
            element={isLoggedIn ? <People /> : <Navigate to="/signup" />}
          />

          <Route
            path="settings"
            element={isLoggedIn ? <Settings /> : <Navigate to="/signup" />}
          />
        </Route>

        <Route
          path="message/:classID/:messageID"
          element={isLoggedIn ? <FullMessage /> : <Navigate to="/signup" />}
        />
        <Route
          path="*"
          element={isLoggedIn ? <Navigate to="/" /> : <Navigate to="/signup" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
