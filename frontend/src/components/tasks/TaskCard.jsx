import React, { useState } from 'react';
import { useTask } from '../../contexts/TaskContext';
import TaskForm from './TaskForm';

export default function TaskCard({ task, isDragging = false }) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const { updateTask, deleteTask, aiSummarize, aiSuggestPriority, aiAutoTag } = useTask();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-500 border-red-500/30';
      case 'medium': return 'from-yellow-500 to-orange-500 border-yellow-500/30';
      case 'low': return 'from-green-500 to-emerald-500 border-green-500/30';
      default: return 'from-gray-500 to-slate-500 border-gray-500/30';
    }
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case 'todo': return 'from-slate-600 to-gray-600';
      case 'doing': return 'from-blue-600 to-indigo-600';
      case 'done': return 'from-green-600 to-emerald-600';
      default: return 'from-gray-600 to-slate-600';
    }
  };

  const handleStatusChange = async (newStatus) => {
    await updateTask(task._id, { status: newStatus });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task._id);
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString();
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <>
      <div 
        className={`group relative glass rounded-xl sm:rounded-2xl p-3 sm:p-5 transition-all duration-500 transform hover:scale-105 ${
          isDragging ? 'opacity-50 rotate-1 sm:rotate-3' : 'hover:rotate-1'
        } ${isOverdue ? 'ring-1 sm:ring-2 ring-red-500/50 animate-pulse-glow' : ''} card-3d cursor-pointer`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        onTouchStart={() => setShowActions(true)}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getStatusGradient(task.status)} opacity-5 rounded-xl sm:rounded-2xl`}></div>
        
        {/* Priority Indicator */}
        <div className={`absolute top-0 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r ${getPriorityColor(task.priority)} rounded-t-xl sm:rounded-t-2xl`}></div>

        {/* Header */}
        <div className="relative flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-sm sm:text-lg line-clamp-2 group-hover:text-gradient transition-all duration-300 pr-2">
              {task.title}
            </h3>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPriorityColor(task.priority)} text-white shadow-lg`}>
                {task.priority}
              </span>
              {task.dueDate && (
                <span className={`text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg ${isOverdue ? 'text-red-400 bg-red-500/20' : 'text-gray-400 bg-gray-500/20'}`}>
                  {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
          
          {/* Actions - Mobile Optimized */}
          <div className={`flex items-center space-x-1 transition-all duration-300 ${
            showActions ? 'opacity-100 translate-x-0' : 'opacity-0 sm:opacity-0 translate-x-4'
          } sm:${showActions ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={() => setShowEditForm(true)}
              className="p-1.5 sm:p-2 glass rounded-lg hover:bg-white/20 transition-all duration-300 hover-lift group/btn"
              title="Edit task"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover/btn:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 sm:p-2 glass rounded-lg hover:bg-red-500/20 transition-all duration-300 hover-lift group/btn"
              title="Delete task"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover/btn:text-red-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        {(task.summary || task.description) && (
          <div className="mb-3 sm:mb-4">
            <p className="text-gray-300 text-xs sm:text-sm line-clamp-3 leading-relaxed">
              {task.summary || task.description}
            </p>
          </div>
        )}

        {/* Tags - Mobile Responsive */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            {task.tags.slice(0, window.innerWidth < 640 ? 2 : task.tags.length).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30 hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300 hover-lift"
              >
                #{tag}
              </span>
            ))}
            {window.innerWidth < 640 && task.tags.length > 2 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* AI Actions - Mobile Optimized */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => aiSummarize(task._id)}
              className="ai-button p-1.5 sm:p-2 glass rounded-lg hover:bg-purple-500/20 transition-all duration-300 group/ai"
              title="AI Summarize"
            >
              <span className="text-sm sm:text-lg group-hover/ai:scale-110 transition-transform duration-300">✂️</span>
            </button>
            <button
              onClick={() => aiSuggestPriority(task._id)}
              className="ai-button p-1.5 sm:p-2 glass rounded-lg hover:bg-blue-500/20 transition-all duration-300 group/ai"
              title="Suggest Priority"
            >
              <span className="text-sm sm:text-lg group-hover/ai:scale-110 transition-transform duration-300">🧠</span>
            </button>
            <button
              onClick={() => aiAutoTag(task._id)}
              className="ai-button p-1.5 sm:p-2 glass rounded-lg hover:bg-green-500/20 transition-all duration-300 group/ai"
              title="Auto Tag"
            >
              <span className="text-sm sm:text-lg group-hover/ai:scale-110 transition-transform duration-300">#</span>
            </button>
          </div>

          {/* Status Badge - Mobile Responsive */}
          <div className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusGradient(task.status)} text-white shadow-lg`}>
            <span className="hidden sm:inline">
              {task.status === 'todo' ? 'To Do' : task.status === 'doing' ? 'In Progress' : 'Completed'}
            </span>
            <span className="sm:hidden">
              {task.status === 'todo' ? 'Todo' : task.status === 'doing' ? 'Doing' : 'Done'}
            </span>
          </div>
        </div>

        {/* Status Change Buttons - Mobile Responsive */}
        {task.status !== 'done' && (
          <div className="mt-3 sm:mt-4 flex space-x-2">
            {task.status === 'todo' && (
              <button
                onClick={() => handleStatusChange('doing')}
                className="flex-1 py-1.5 sm:py-2 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="hidden sm:inline">Start Task</span>
                <span className="sm:hidden">Start</span>
              </button>
            )}
            {task.status === 'doing' && (
              <button
                onClick={() => handleStatusChange('done')}
                className="flex-1 py-1.5 sm:py-2 px-3 sm:px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Complete
              </button>
            )}
          </div>
        )}

        {/* Completion Celebration */}
        {task.status === 'done' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-lg sm:text-2xl animate-bounce">🎉</div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl sm:rounded-2xl"></div>
          </div>
        )}

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:via-blue-500/5 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none"></div>
      </div>

      {/* Edit Form Modal - Mobile Responsive */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="animate-slide-in-up w-full max-w-md">
            <TaskForm 
              task={task}
              onClose={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}