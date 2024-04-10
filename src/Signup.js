import React, { useState } from "react";
import { db } from './firebase';
import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import { getDocs, addDoc, collection, where, query } from 'firebase/firestore';
import Loader from "./Component/Loader";

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showLoader, setShowLoader] = useState(false);


    const navigate = useNavigate();
    const dbref = collection(db, "Users");
    const signup = async () => {
        const matchEmail = query(dbref, where('Email', '==', email));
        try {
            const snapshot = await getDocs(matchEmail);
            const emailMatchingArray = snapshot.docs.map((doc) => doc.data());
            if (emailMatchingArray.length > 0) {
                alert("This Email address already exists");
            } else {
                await addDoc(dbref, { Name: name, Email: email, Password: password });
                // alert('signup successfull');
                setShowLoader(true);
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            }
        } catch (error) {
            alert(error);
        }

    };


    return (
        <>
            <div className="container">
                <div className="form">
                    <h2>Sign Up</h2>
                    <div className="box">
                        <input type="text" placeholder="Username" onChange={(e) => setName(e.target.value)}></input>
                    </div>
                    <div className="box">
                        <input type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)}></input>
                    </div>
                    <div className="box">
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}></input>
                    </div>
                    <p>Already have an Account <Link to='/signin'>Sign In</Link></p>
                    <button onClick={signup}>Sign Up</button>
                </div>
            </div>
            {showLoader && <Loader />}
        </>
    );
};

export default Signup;