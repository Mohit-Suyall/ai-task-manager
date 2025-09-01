import React from 'react';

export default function Sidebar({ view, setView, filter, onFilterChange, onClose }) {
  const filterOptions = [
    { value: 'all', label: 'All Tasks', icon: '📋', count: null },
    { value: 'todo', label: 'To Do', icon: '⏳', count: null },
    { value: 'doing', label: 'In Progress', icon: '🔄', count: null },
    { value: 'done', label: 'Completed', icon: '✅', count: null }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities', icon: '🎯' },
    { value: 'high', label: 'High Priority', icon: '🔴' },
    { value: 'medium', label: 'Medium Priority', icon: '🟡' },
    { value: 'low', label: 'Low Priority', icon: '🟢' }
  ];

  const handleFilterClick = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  const handleViewChange = (newView) => {
    setView(newView);
    // Close sidebar on mobile after view change
    if (window.innerWidth < 768 && onClose) {
      onClose();
    }
  };

  return (
    <div className="w-64 sm:w-72 md:w-80 h-screen glass border-r border-white/10 backdrop-blur-xl overflow-y-auto">
      {/* Mobile Close Button */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white">Menu</h2>
        <button
          onClick={onClose}
          className="p-2 glass rounded-lg hover:bg-white/20 transition-all duration-300"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 sm:p-6">
        {/* View Toggle */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">View Mode</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button
              onClick={() => handleViewChange('kanban')}
              className={`p-3 sm:p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                view === 'kanban'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'glass text-gray-300 hover:text-white hover:bg-white/20'
              }`}
            >
              <div className="text-center">
                <div className="text-lg sm:text-xl mb-1 sm:mb-2">📋</div>
                <div className="text-xs sm:text-sm font-medium">Kanban</div>
              </div>
            </button>
            <button
              onClick={() => handleViewChange('list')}
              className={`p-3 sm:p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                view === 'list'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'glass text-gray-300 hover:text-white hover:bg-white/20'
              }`}
            >
              <div className="text-center">
                <div className="text-lg sm:text-xl mb-1 sm:mb-2">📝</div>
                <div className="text-xs sm:text-sm font-medium">List</div>
              </div>
            </button>
          </div>
        </div>

        {/* Status Filters */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">Status</h3>
          <div className="space-y-1 sm:space-y-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterClick('status', option.value)}
                className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all duration-300 transform hover:scale-105 sidebar-item ${
                  filter.status === option.value
                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30'
                    : 'glass text-gray-300 hover:text-white hover:bg-white/20'
                }`}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-base sm:text-lg">{option.icon}</span>
                  <span className="text-sm sm:text-base font-medium">{option.label}</span>
                </div>
                {filter.status === option.value && (
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filters */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">Priority</h3>
          <div className="space-y-1 sm:space-y-2">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterClick('priority', option.value)}
                className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all duration-300 transform hover:scale-105 sidebar-item ${
                  filter.priority === option.value
                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30'
                    : 'glass text-gray-300 hover:text-white hover:bg-white/20'
                }`}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-base sm:text-lg">{option.icon}</span>
                  <span className="text-sm sm:text-base font-medium">{option.label}</span>
                </div>
                {filter.priority === option.value && (
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* AI Features */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">AI Features</h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="glass p-3 sm:p-4 rounded-xl">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <span className="text-lg sm:text-xl">🤖</span>
                <span className="text-sm sm:text-base font-medium text-white">Smart Assistant</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">
                AI-powered task analysis and suggestions
              </p>
            </div>
            
            <div className="glass p-3 sm:p-4 rounded-xl">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <span className="text-lg sm:text-xl">✂️</span>
                <span className="text-sm sm:text-base font-medium text-white">Auto Summarize</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">
                Automatically summarize long descriptions
              </p>
            </div>
            
            <div className="glass p-3 sm:p-4 rounded-xl">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <span className="text-lg sm:text-xl">#</span>
                <span className="text-sm sm:text-base font-medium text-white">Smart Tags</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">
                Generate relevant tags automatically
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            <button className="glass p-3 sm:p-4 rounded-xl hover:bg-white/20 transition-all duration-300 hover-lift group">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300">📊</span>
                <span className="text-sm sm:text-base font-medium text-white">Analytics</span>
              </div>
            </button>
            
            <button className="glass p-3 sm:p-4 rounded-xl hover:bg-white/20 transition-all duration-300 hover-lift group">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300">📤</span>
                <span className="text-sm sm:text-base font-medium text-white">Export</span>
              </div>
            </button>
            
            <button className="glass p-3 sm:p-4 rounded-xl hover:bg-white/20 transition-all duration-300 hover-lift group">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300">⚙️</span>
                <span className="text-sm sm:text-base font-medium text-white">Settings</span>
              </div>
            </button>
          </div>
        </div>

        {/* Current Filter Display */}
        {(filter.status !== 'all' || filter.priority !== 'all' || filter.search) && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">Active Filters</h3>
            <div className="space-y-1 sm:space-y-2">
              {filter.status !== 'all' && (
                <div className="flex items-center justify-between glass p-2 sm:p-3 rounded-lg">
                  <span className="text-xs sm:text-sm text-white">Status: {filter.status}</span>
                  <button
                    onClick={() => handleFilterClick('status', 'all')}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {filter.priority !== 'all' && (
                <div className="flex items-center justify-between glass p-2 sm:p-3 rounded-lg">
                  <span className="text-xs sm:text-sm text-white">Priority: {filter.priority}</span>
                  <button
                    onClick={() => handleFilterClick('priority', 'all')}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {filter.search && (
                <div className="flex items-center justify-between glass p-2 sm:p-3 rounded-lg">
                  <span className="text-xs sm:text-sm text-white truncate">Search: "{filter.search}"</span>
                  <button
                    onClick={() => handleFilterClick('search', '')}
                    className="text-gray-400 hover:text-white transition-colors duration-300 ml-2"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 sm:pt-6 border-t border-white/10">
          <div className="text-center">
            <div className="text-xs sm:text-sm text-gray-400 mb-2">AI Task Manager</div>
            <div className="text-xs text-gray-500">v1.0.0 • No Database Required</div>
          </div>
        </div>
      </div>
    </div>
  );
}