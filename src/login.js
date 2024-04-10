import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './style.css';
import { getDocs, collection, where, query } from "firebase/firestore";
import { db } from './firebase';
import Loader from "./Component/Loader";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const [uid, setUid] = useState('');
    const { state } = useLocation();

    const navigate = useNavigate();
    const login = async () => {
        const dbref = collection(db, 'Users');
        const q = query(dbref, where('Email', '==', email), where('Password', '==', password));

        try {
            // const emailMatch = query(dbref, where('Email', '==', email));
            // const passwordMatch = query(dbref, where('Password', '==', password));
            // const emailSnapshot = await getDocs(emailMatch);
            // const emailArray = emailSnapshot.docs.map((doc) => doc.data());
            // const passwordSnapshot = await getDocs(passwordMatch);
            // const passwordArray = passwordSnapshot.docs.map((doc) => doc.data());

            // if (emailArray.length > 0 && passwordArray.length > 0) {
            //     // alert('Login Successful');
            //     setShowLoader(true);
            //     setTimeout(() => {
            //         navigate("/todo");
            //     }, 2000);
            // }
            // else {
            //     alert("check your email and password or create account");
            // }
            const querySnapshot = await getDocs(q);

            if (querySnapshot.docs.length > 0) {
                setShowLoader(true);
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    console.log("User document ID: ", doc.id);
                    console.log("User data:");
                    console.log(userData);

                    setUid(doc.id);
                    setTimeout(() => {
                        navigate("/todo", {
                            state: {
                                userUid: doc.id,
                            },
                        });
                    }, 2000);
                });
            }
            else {
                alert("check your email and password or create account");
            }


        } catch (error) {
            alert(error);
        }
    };

    return (
        <>
            <div className="container">
                <div className="form">
                    <h2>Login</h2>
                    <div className="box">
                        <input type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)}></input>
                    </div>
                    <div className="box">
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}></input>
                    </div>
                    <p>Dont have an Account <Link to='/'>Sign Up</Link></p>
                    <button onClick={login}>Login</button>
                </div>
            </div>
            {showLoader && <Loader />}
        </>
    );
};

export default Login;