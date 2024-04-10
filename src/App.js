import React from "react";
import Rout from "./route";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Rout />
      </BrowserRouter>
    </>
  );
};

export default App;
