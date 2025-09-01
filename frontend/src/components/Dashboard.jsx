import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import TaskForm from './tasks/TaskForm';
import KanbanBoard from './tasks/KanbanBoard';
import TaskList from './tasks/TaskList';

export default function Dashboard() {
  const [view, setView] = useState('kanban'); // 'kanban' or 'list'
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { user, logout } = useAuth();
  const { tasks, loading, filter, setFilter } = useTask();

  const handleSearch = (searchTerm) => {
    setFilter(prev => ({ ...prev, search: searchTerm }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilter(prev => ({ ...prev, [filterType]: value }));
    // Close sidebar on mobile after filter change
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs - Responsive sizes */}
        <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-16 h-16 sm:w-32 sm:h-32 bg-purple-500/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-20 right-16 sm:top-40 sm:right-32 w-12 h-12 sm:w-24 sm:h-24 bg-blue-500/20 rounded-full blur-xl animate-bounce-slow"></div>
        <div className="absolute bottom-16 left-1/4 sm:bottom-32 w-20 h-20 sm:w-40 sm:h-40 bg-indigo-500/10 rounded-full blur-2xl animate-pulse"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Mobile Sidebar Overlay */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setShowSidebar(false)}
          ></div>
        )}

        {/* Sidebar */}
        <div className={`
          fixed md:relative z-50 md:z-10
          transform transition-transform duration-300 ease-in-out
          ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          animate-slide-in-left
        `}>
          <Sidebar 
            view={view} 
            setView={setView}
            filter={filter}
            onFilterChange={handleFilterChange}
            onClose={() => setShowSidebar(false)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col animate-slide-in-right w-full md:w-auto">
          {/* Header */}
          <div className="animate-slide-in-up">
            <Header 
              user={user}
              onSearch={handleSearch}
              onLogout={logout}
              onNewTask={() => setShowTaskForm(true)}
              onToggleSidebar={() => setShowSidebar(!showSidebar)}
            />
          </div>

          {/* Content Area */}
          <main className="flex-1 p-3 sm:p-6 relative">
            {/* Loading State */}
            {loading && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
                <div className="glass p-6 sm:p-8 rounded-2xl text-center mx-4">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-white font-medium text-sm sm:text-base">Loading your tasks...</p>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              {view === 'kanban' ? (
                <KanbanBoard tasks={tasks} />
              ) : (
                <TaskList tasks={tasks} />
              )}
            </div>

            {/* Floating Action Button - Mobile Optimized */}
            <button
              onClick={() => setShowTaskForm(true)}
              className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 transform hover:scale-110 transition-all duration-300 z-40 btn-3d group"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              
              {/* Ripple Effect */}
              <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
            </button>

            {/* Stats Cards - Mobile Responsive */}
            <div className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 space-y-1 sm:space-y-2 z-30">
              <div className="glass p-2 sm:p-3 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm hover-lift">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="hidden sm:inline">{tasks.filter(t => t.status === 'done').length} Completed</span>
                  <span className="sm:hidden">{tasks.filter(t => t.status === 'done').length}</span>
                </div>
              </div>
              <div className="glass p-2 sm:p-3 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm hover-lift">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="hidden sm:inline">{tasks.filter(t => t.status === 'doing').length} In Progress</span>
                  <span className="sm:hidden">{tasks.filter(t => t.status === 'doing').length}</span>
                </div>
              </div>
              <div className="glass p-2 sm:p-3 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm hover-lift">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="hidden sm:inline">{tasks.filter(t => t.status === 'todo').length} To Do</span>
                  <span className="sm:hidden">{tasks.filter(t => t.status === 'todo').length}</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Task Form Modal - Mobile Responsive */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="animate-slide-in-up w-full max-w-md">
            <TaskForm 
              onClose={() => setShowTaskForm(false)}
            />
          </div>
        </div>
      )}

      {/* Particles - Reduced on mobile */}
      <div className="particles">
        {[...Array(typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}