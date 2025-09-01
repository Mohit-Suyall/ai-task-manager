import React from 'react';
import TaskCard from './TaskCard';

export default function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-sm">Create your first task to get started!</p>
        </div>
      </div>
    );
  }

  // Group tasks by status for better organization
  const groupedTasks = tasks.reduce((acc, task) => {
    const status = task.status || 'todo';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {});

  const statusOrder = ['todo', 'doing', 'done'];
  const statusLabels = {
    todo: 'To Do',
    doing: 'In Progress', 
    done: 'Completed'
  };

  return (
    <div className="space-y-8">
      {statusOrder.map((status) => {
        const statusTasks = groupedTasks[status] || [];
        
        if (statusTasks.length === 0) return null;

        return (
          <div key={status}>
            <div className="flex items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {statusLabels[status]}
              </h2>
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                {statusTasks.length}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statusTasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}