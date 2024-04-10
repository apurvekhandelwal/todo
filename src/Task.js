import React, { useState } from 'react';

const Task = ({ user, addTask, tasks }) => {
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'low',
    });

    const handleOnChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };

    const handleOnSubmit = (userId, todoId) => {
        if (!newTask.title.trim()) return;
        const taskToAdd = {
            ...newTask,
            id: Date.now(),
            userId,
            todoId,
        }
        if (user && user?.todos?.length > 0) {
            addTask(taskToAdd);
            setNewTask({
                title: '',
                description: '',
                dueDate: '',
                priority: 'low',
            });
        }
    };

    return (
        <div className="task-form">
            <h3>Tasks:</h3>
            {tasks.length > 0 && (
                <ul>
                    {tasks.map((task, index) => (
                        <li key={index}>
                            <div>Title: {task.title}</div>
                            <div>Description: {task.description}</div>
                            <div>Due Date: {task.dueDate}</div>
                            <div>
                                Priority:
                                {task.priority}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={() => handleOnSubmit(user?.id, user?.todos[0]?.id)}>
                <input
                    type="text"
                    name="title"
                    placeholder="Enter title"
                    value={newTask.title}
                    onChange={handleOnChange}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Enter description"
                    value={newTask.description}
                    onChange={handleOnChange}
                />
                <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleOnChange}
                />
                <div>
                    <select
                        name="priority"
                        value={newTask.priority}
                        onChange={handleOnChange}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
};

export default Task;