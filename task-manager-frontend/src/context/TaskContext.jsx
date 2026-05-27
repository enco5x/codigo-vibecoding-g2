import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { taskApi } from '../api/taskApi';
import { FILTERS } from '../lib/constants';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState(FILTERS.ALL);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskApi.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(async (data) => {
    setLoading(true);
    try {
      const newTask = await taskApi.create(data);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id, data) => {
    setLoading(true);
    try {
      const updatedTask = await taskApi.update(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      return updatedTask;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    setLoading(true);
    try {
      await taskApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleComplete = useCallback(async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    return updateTask(id, { completed: !task.completed });
  }, [tasks, updateTask]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === FILTERS.PENDING) return matchesSearch && !task.completed;
    if (filter === FILTERS.COMPLETED) return matchesSearch && task.completed;
    return matchesSearch;
  });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        filter,
        setFilter,
        createTask,
        updateTask,
        deleteTask,
        toggleComplete,
        fetchTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
}