import React, { useState } from 'react';

const AddTaskModal = ({ handleTaskAddition }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: null,
        priority: 'low',
    });

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const handleTaskChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleTaskAddition(newTask);
        setNewTask({
            title: '',
            description: '',
            dueDate: null,
            priority: 'low',
        });
        setIsOpen(false);
    };

    return (
        <div>
            <button onClick={handleOpenModal}>Add Task</button>
            {isOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>
                            &times;
                        </span>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                value={newTask.title}
                                onChange={handleTaskChange}
                                required
                            />
                            <label htmlFor="description">Description:</label>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                value={newTask.description}
                                onChange={handleTaskChange}
                            />
                            <label htmlFor="dueDate">Due Date:</label>
                            <input
                                type="date"
                                name="dueDate"
                                id="dueDate"
                                value={newTask.dueDate?.toISOString().slice(0, 10)}
                                onChange={(e) =>
                                    handleTaskChange({
                                        target: {
                                            name: 'dueDate',
                                            value: e.target.value,
                                        },
                                    })
                                }
                            />
                            <label htmlFor="priority">Priority:</label>
                            <select
                                name="priority"
                                id="priority"
                                value={newTask.priority}
                                onChange={handleTaskChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            <button type="submit">Add Task</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddTaskModal;