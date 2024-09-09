import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
    document.body.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('light', !isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!taskInput) return;
    const newTask = {
      id: Date.now(),
      text: taskInput,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskInput('');
  };

  const editTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    setTaskInput(taskToEdit.text);
    setEditingTaskId(id);
  };

  const updateTask = () => {
    setTasks(tasks.map(task => task.id === editingTaskId ? { ...task, text: taskInput } : task));
    setTaskInput('');
    setEditingTaskId(null);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleCompletion = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editingTaskId ? updateTask() : addTask();
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Lista de Tarefas</h1>
        <label className="switch">
          <input type="checkbox" checked={!isDarkMode} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Adicione uma nova tarefa"
        />
        <button type="submit">{editingTaskId ? 'Atualizar' : 'Adicionar'}</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              onClick={() => toggleCompletion(task.id)}
            >
              {task.text}
            </span>
            <button className='editar' onClick={() => editTask(task.id)}>Editar</button>
            <button className='excluir' onClick={() => deleteTask(task.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
