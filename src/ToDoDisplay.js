import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { getUserById } from "./useFirebase";
import { addDoc, collection, query, where, getDocs, doc, onSnapshot, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, auth } from "./firebase";
import UserProfile from "./UserProfile";
import './Style/TodoDispaly.css';


const Todo = () => {
    const { state } = useLocation();
    const userId = state?.userUid;

    // const [user, setUser] = useState({
    //     Name: '',
    // });


    const [todolistname, setTodolistname] = useState("");
    const [newTodolistName, setNewTodolistName] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [priority, setPriority] = useState("Low");
    const [todolistOptions, setTodolistOptions] = useState([]);

    const today = new Date().toISOString().split("T")[0];

    const handleTodoListChange = (e) => {
        const selectedValue = e.target.value;
        setTodolistname(selectedValue);

        if (selectedValue !== "addNew") {
            setNewTodolistName("");
        }
    };

    const handleNewTodoListNameChange = (e) => {
        setNewTodolistName(e.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRef = doc(db, "Users", userId);
                const q = query(collection(userRef, "todolists"));
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const options = [];
                    snapshot.forEach((doc) => {
                        options.push(doc.data().name);
                    });
                    setTodolistOptions(options);
                });
                // console.log(userId);
                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching todo lists:", error);
            }
        };

        fetchData();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            if (userId) {
                const selectedTodoListName = newTodolistName || todolistname;

                if (
                    !selectedTodoListName ||
                    selectedTodoListName === "Select Todo List"
                ) {
                    console.log("Please select a todo list.");
                    return;
                }

                const userRef = doc(db, "Users", userId);
                const userDoc = await getDoc(userRef);
                const userEmail = userDoc.data().Email;
                const todolistQuery = query(
                    collection(userRef, "todolists"),
                    where("name", "==", selectedTodoListName)
                );
                const todolistSnapshot = await getDocs(todolistQuery);

                if (todolistSnapshot.empty && newTodolistName) {
                    const newTodolistRef = await addDoc(
                        collection(userRef, "todolists"),
                        {
                            name: newTodolistName,
                            userID: userId,
                            creationTime: serverTimestamp(),
                            lastUpdated: serverTimestamp()
                        }
                    );

                    await addDoc(collection(newTodolistRef, "tasks"), {
                        title: title,
                        description: description,
                        date: date,
                        priority: priority,
                        timeOfCreation: serverTimestamp(),
                        userEmail: userEmail,
                        todoListTitle: newTodolistName
                    });
                } else if (!todolistSnapshot.empty) {
                    todolistSnapshot.forEach(async (doc) => {
                        await addDoc(collection(doc.ref, "tasks"), {
                            title: title,
                            description: description,
                            date: date,
                            priority: priority,
                            timeOfCreation: serverTimestamp(),
                            userEmail: userEmail,
                            todoListTitle: selectedTodoListName
                        });
                    });
                }
                setTodolistname("");
                setNewTodolistName("");
                setTitle("");
                setDescription("");
                setDate("");
                setPriority("Low");
            } else {
                console.log("User is not signed in to add todo list to database");
            }

        } catch (error) {
            console.error(error.message);
        }
    };

    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut().then(() => {
            // Sign-out successful.
            console.log("User signed out successfully.");
            navigate("/signin");
        }).catch((error) => {
            // An error happened.
            console.log("Error signing out:", error);
        });
    };
    return (
        <div className="container">

            <button onClick={handleLogout} className="logout-button">Logout</button>

            <form onSubmit={handleSubmit} className="form">
                <select
                    value={todolistname}
                    onChange={handleTodoListChange}
                    className="input"
                    required // Make the select field required
                >
                    <option value="" disabled>
                        Select Todo List
                    </option>
                    {todolistOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                    <option value="addNew">Add New Todo List</option>
                </select>
                {todolistname === "addNew" && (
                    <input
                        type="text"
                        placeholder="Enter New Todo List Name"
                        value={newTodolistName}
                        onChange={handleNewTodoListNameChange}
                        className="input"
                        required // Make the input field required
                    />
                )}
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required // Make the input field required
                    className="input"
                />
                <input
                    type="date"
                    value={date}
                    min={today}
                    onChange={(e) => setDate(e.target.value)}
                    required // Make the input field required
                    className="input"
                />
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    required // Make the select field required
                    className="select"
                >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required // Make the textarea field required
                    className="textarea"
                ></textarea>
                <button type="submit" className="button">
                    Add Todo
                </button>
            </form>
            <br />
            <div>
                <UserProfile id={userId} />
            </div>
        </div>
    );
};

export default Todo;