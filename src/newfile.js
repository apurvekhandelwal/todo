import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUserById } from "./useFirebase";
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "./firebase";
import TaskModal from "./Component/TaskModal"; // Import TaskModal

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

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    useEffect(() => {
        if (userId) {
            const fetchUser = async () => {
                const fetchedUser = await getUserById(userId);
                if (fetchedUser) {
                    setUser(prevUser => ({
                        ...prevUser,
                        Name: fetchedUser.Name,
                    }));
                }
            };
            fetchUser();
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            const fetchTodos = async () => {
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
                    });
                });

                setTodos(todosList);
            };

            fetchTodos();
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

            setNewTask({ title: '', description: '', dueDate: null, priority: 'low' });
            setIsTaskModalOpen(false);
        } catch (error) {
            console.error('Error adding task: ', error);
        }
    };

    return (
        <div className="App">
            <h1>Welcome {user.Name}</h1>
            <form onSubmit={handleTodoSubmit}>
                <input type="text" value={newTodo.name} onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })} placeholder="Enter new todo" />
                <button type="submit">Add Todo</button>
            </form>
            <div>
                {todos.map((todo) => (
                    <div key={todo.id}>
                        <h2>{todo.name}</h2>
                        <button onClick={() => {
                            setTodos(prevTodos => {
                                return prevTodos.map((t) => {
                                    if (t.id === todo.id) {
                                        return { ...todo, completed: !todo.completed };
                                    }
                                    return t;
                                });
                            });
                        }}>
                            {todo.completed ? 'Uncomplete' : 'Complete'}
                        </button>
                        <button onClick={() => {
                            setIsTaskModalOpen(true);
                        }}>
                            Add Task
                        </button>
                        <TaskModal
                            isOpen={isTaskModalOpen}
                            setIsTaskModalOpen={setIsTaskModalOpen}
                            todoId={todo.id}
                            onTaskSubmit={handleTaskSubmit}
                        />
                        {todo.tasks && todo.tasks.map((task) => (
                            <div key={task.id}>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <p>{task.dueDate}</p>
                                <p>{task.priority}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Todo;