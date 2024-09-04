
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Election from "./Pages/Elections";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";

import { Route, Routes } from "react-router-dom";
import Election from "./Pages/Elections";
import Home from "./Pages/Home";


const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/elections" element={<Election />} />

        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </>
  );
};

export default App;
