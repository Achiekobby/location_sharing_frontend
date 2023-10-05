import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Layout from "./components/Layout/Layout"
import Location from "./pages/Location";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="location/:roomId" element={<Location/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
