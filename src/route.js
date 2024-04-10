import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./login";
import Todo from "./ToDoDisplay";


const Rout = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Signup />} />
                <Route path='/signin' element={<Login />} />
                <Route path='/todo' element={<Todo />} />
            </Routes>
        </>
    );
};

export default Rout;