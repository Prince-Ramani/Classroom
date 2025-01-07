import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Signup from "./customComponents/Signup/Signup";
import Signin from "./customComponents/Signin/Signin";
import { useQuery } from "@tanstack/react-query";

const App = () => {
  const { data } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/getme");
      const data = await res.json();
      return data;
    },
  });

  const isLoggedIn = !!data?._id;

  console.log(isLoggedIn);

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </Router>
  );
};

export default App;
