import React from 'react';
import { useTask } from '../../contexts/TaskContext';
import TaskCard from './TaskCard';

export default function KanbanBoard({ tasks }) {
  const { updateTask } = useTask();

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
    { id: 'doing', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'done', title: 'Completed', color: 'bg-green-100' }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(task));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    if (taskData.status !== newStatus) {
      await updateTask(taskData._id, { status: newStatus });
    }
  };

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div key={column.id} className="flex flex-col">
              {/* Column Header */}
              <div className={`${column.color} rounded-lg p-4 mb-4`}>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800">{column.title}</h2>
                  <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div
                className="flex-1 space-y-3 min-h-96 p-2 rounded-lg border-2 border-dashed border-gray-200 transition-colors hover:border-gray-300"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {columnTasks.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-gray-400">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📝</div>
                      <div className="text-sm">No tasks</div>
                    </div>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      className="cursor-move"
                    >
                      <TaskCard task={task} />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}