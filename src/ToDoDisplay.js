import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUserById } from "./useFirebase";
import { addDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { db } from "./firebase";

const Todo = () => {
    const { state } = useLocation();
    const userId = state?.userUid;

    const [user, setUser] = useState({
        Name: '',
    });

    const [newTodo, setNewTodo] = useState({
        name: '',
        completed: false,
    });

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: null,
        priority: 'low',
    });

    const [todos, setTodos] = useState([]);

    const getTodoDetails = async (userId) => {
        if (!userId) return;

        const todoQuery = query(collection(db, "Todos"), where("userID", "==", userId));
        const querySnapshot = await getDocs(todoQuery);

        const todosList = [];
        querySnapshot.forEach((doc) => {
            const todo = { ...doc.data(), id: doc.id };
            const tasksQuery = query(collection(db, "Tasks"), where("todoID", "==", todo.id));
            getDocs(tasksQuery).then((taskSnapshot) => {
                const tasksList = [];
                taskSnapshot.forEach((taskDoc) => {
                    tasksList.push({ ...taskDoc.data(), id: taskDoc.id });
                });
                todo.tasks = tasksList;
                todosList.push(todo);

                console.log("User Name:", user.Name);
                console.log("Todo ID:", todo.id);
                console.log("Todo Name:", todo.name);
                console.log("Tasks:", todo.tasks);
            });
        });

        setTodos(todosList);
    };

    useEffect(() => {
        if (userId) {
            const fetchUser = async () => {
                const fetchedUser = await getUserById(userId);
                if (fetchedUser) {
                    setUser(prevUser => ({
                        ...prevUser,
                        Name: fetchedUser.Name,
                    }));
                    // Fetch todo details with tasks
                    getTodoDetails(userId);
                }
            };
            fetchUser();
        }
    }, [userId]);

    const handleTodoSubmit = async (e) => {
        e.preventDefault();

        const newTodoWithUserID = { ...newTodo, userID: userId };

        try {
            const docRef = await addDoc(collection(db, 'Todos'), newTodoWithUserID);
            const newTodo = { ...newTodoWithUserID, id: docRef.id };
            setTodos((prevTodos) => [...prevTodos, newTodo]);
            setNewTodo({ name: '', completed: false });

            console.log("New todo ID: ", newTodo.id);
        } catch (error) {
            console.error('Error adding todo: ', error);
        }
    };

    const handleTaskSubmit = async (todoId) => {
        const newTaskWithTodoID = { ...newTask, todoID: todoId };

        try {
            setNewTask(prevNewTask => ({ ...prevNewTask, todoID: todoId })); // Update newTask with todoID
            const docRef = await addDoc(collection(db, 'Tasks'), newTaskWithTodoID);
            const newTask = { ...newTaskWithTodoID, id: docRef.id };

            setTodos((prevTodos) => {
                const updatedTodos = prevTodos.map((todo) => {
                    if (todo.id === todoId) {
                        return { ...todo, tasks: (todo.tasks || []).concat(newTask) };
                    }
                    return todo;
                });
                return updatedTodos;
            });

            setNewTask({ title: '', description: '', dueDate: null, priority: 'low', todoID: '' });
        } catch (error) {
            console.error('Error adding task: ', error);
        }
    };

    const q = query(collection(db, 'Todos'), where('userID', '==', userId));

    useEffect(() => {
        const getTodos = async () => {
            const querySnapshot = await getDocs(q);
            const todosList = [];
            querySnapshot.forEach((doc) => {
                todosList.push({ ...doc.data(), id: doc.id });
            });
            setTodos(todosList);
        };

        if (userId) {
            getTodos();
        }
    }, [userId, q]);

    return (
        <>
            {user && (
                <>
                    <h1>Create New Todo ({user.Name})</h1>
                    <form onSubmit={handleTodoSubmit}>
                        <label htmlFor="name">Todo Name:</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={newTodo.name}
                            onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
                            required
                        />
                        <button type="submit">Add Todo</button>
                    </form>
                    <ul>
                        {todos && todos.map((todo) => (
                            <li key={todo.id}>
                                <h3>{todo.name}</h3>
                                {todo.tasks && (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Description</th>
                                                <th>Due Date</th>
                                                <th>Priority</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {todo.tasks.map((task, index) => (
                                                <tr key={task.id}>
                                                    <td><strong>{task.title}</strong></td>
                                                    <td>{task.description}</td>
                                                    <td>{task.dueDate?.toLocaleDateString()}</td>
                                                    <td>{task.priority}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleTaskSubmit(todo.id);
                                }}>
                                    <label htmlFor="title">Task Title:</label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        required
                                    />
                                    <label htmlFor="description">Task Description:</label>
                                    <input
                                        type="text"
                                        name="description"
                                        id="description"
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    />
                                    <label htmlFor="dueDate">Task Due Date:</label>
                                    <input
                                        type="date"
                                        name="dueDate"
                                        id="dueDate"
                                        value={newTask.dueDate?.toISOString().slice(0, 10)}
                                        onChange={(e) => setNewTask({
                                            ...newTask,
                                            dueDate: e.target.value ? new Date(e.target.value) : null,
                                        })}
                                    />
                                    <label htmlFor="priority">
                                        Task Priority:
                                        <select
                                            name="priority"
                                            id="priority"
                                            value={newTask.priority}
                                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </label>
                                    <button type="submit">Add Task</button>
                                </form>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
};

export default Todo;