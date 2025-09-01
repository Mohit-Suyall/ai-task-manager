import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ status: 'all', priority: 'all', search: '' });
  const { token, API_BASE } = useAuth();
  const { showToast } = useToast();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filter.status !== 'all') queryParams.append('status', filter.status);
      if (filter.priority !== 'all') queryParams.append('priority', filter.priority);
      if (filter.search) queryParams.append('search', filter.search);

      const response = await fetch(`${API_BASE}/api/tasks?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        showToast('Failed to fetch tasks', 'error');
      }
    } catch (error) {
      showToast('Network error', 'error');
    } finally {
      setLoading(false);
    }
  }, [API_BASE, token, filter, showToast]);

  const createTask = async (taskData) => {
    try {
      const response = await fetch(`${API_BASE}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks(prev => [newTask, ...prev]);
        showToast('Task created successfully', 'success');
        return { success: true, task: newTask };
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to create task', 'error');
        return { success: false };
      }
    } catch (error) {
      showToast('Network error', 'error');
      return { success: false };
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const response = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prev => prev.map(task => 
          task._id === taskId ? updatedTask : task
        ));
        showToast('Task updated successfully', 'success');
        return { success: true, task: updatedTask };
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to update task', 'error');
        return { success: false };
      }
    } catch (error) {
      showToast('Network error', 'error');
      return { success: false };
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTasks(prev => prev.filter(task => task._id !== taskId));
        showToast('Task deleted successfully', 'success');
        return { success: true };
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to delete task', 'error');
        return { success: false };
      }
    } catch (error) {
      showToast('Network error', 'error');
      return { success: false };
    }
  };

  const aiSummarize = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE}/api/ai/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ taskId })
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(prev => prev.map(task => 
          task._id === taskId ? { ...task, summary: data.summary } : task
        ));
        showToast('Task summarized by AI', 'success');
        return { success: true, summary: data.summary };
      } else {
        showToast('Failed to summarize task', 'error');
        return { success: false };
      }
    } catch (error) {
      showToast('Network error', 'error');
      return { success: false };
    }
  };

  const aiSuggestPriority = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE}/api/ai/suggest-priority`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ taskId })
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(prev => prev.map(task => 
          task._id === taskId ? { ...task, priority: data.priority } : task
        ));
        showToast(`Priority suggested: ${data.priority}`, 'success');
        return { success: true, priority: data.priority };
      } else {
        showToast('Failed to suggest priority', 'error');
        return { success: false };
      }
    } catch (error) {
      showToast('Network error', 'error');
      return { success: false };
    }
  };

  const aiAutoTag = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE}/api/ai/auto-tag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ taskId })
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(prev => prev.map(task => 
          task._id === taskId ? { ...task, tags: data.tags } : task
        ));
        showToast('Tags generated by AI', 'success');
        return { success: true, tags: data.tags };
      } else {
        showToast('Failed to generate tags', 'error');
        return { success: false };
      }
    } catch (error) {
      showToast('Network error', 'error');
      return { success: false };
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token, fetchTasks]);

  const value = {
    tasks,
    loading,
    filter,
    setFilter,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    aiSummarize,
    aiSuggestPriority,
    aiAutoTag
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};