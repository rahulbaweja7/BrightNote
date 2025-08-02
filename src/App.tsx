import React, { useState, useEffect, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { Plus, Heart, Calendar, Sun, Settings, BarChart3, Download, Upload, Moon, Bell, CheckCircle, AlertCircle, X, Search, Filter, Share2, Info, Grid3X3 } from 'lucide-react';
import './App.css';
import { GratitudeBento } from './components/GratitudeBento';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  timestamp: number;
  mood?: number; // 1-5 scale
  tags?: string[];
  hasImage?: boolean;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [entryText, setEntryText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'bento'>('calendar');

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('oneGoodThingEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('oneGoodThingEntries', JSON.stringify(entries));
  }, [entries]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'n' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowEntryModal(true);
      }
      if (e.key === 'Escape') {
        setShowEntryModal(false);
        setShowNavMenu(false);
        setShowSearch(false);
      }
      if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowSearch(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id, duration: toast.duration || 3000 };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }, [removeToast]);

  const getEntryForDate = (date: Date) => {
    return entries.find(entry => isSameDay(new Date(entry.date), date));
  };

  const addEntry = async () => {
    if (!entryText.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: selectedDate.toISOString().split('T')[0],
      content: entryText.trim(),
      timestamp: Date.now(),
      mood: 4, // Default mood
      tags: extractTags(entryText),
    };

    setEntries(prev => [...prev, newEntry]);
    setEntryText('');
    setShowEntryModal(false);
    setEditingEntry(null);
    setIsLoading(false);
    
    addToast({
      type: 'success',
      message: 'Entry saved successfully! ✨',
    });
  };

  const updateEntry = async () => {
    if (!editingEntry || !entryText.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedEntry: JournalEntry = {
      ...editingEntry,
      content: entryText.trim(),
      tags: extractTags(entryText),
    };

    setEntries(prev => prev.map(entry => 
      entry.id === editingEntry.id ? updatedEntry : entry
    ));
    
    setEntryText('');
    setShowEntryModal(false);
    setEditingEntry(null);
    setIsLoading(false);
    
    addToast({
      type: 'success',
      message: 'Entry updated successfully! ✨',
    });
  };

  const extractTags = (text: string): string[] => {
    const tagRegex = /#(\w+)/g;
    const matches = text.match(tagRegex);
    return matches ? matches.map(tag => tag.slice(1)) : [];
  };

  const deleteEntry = async (entryId: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    setEntries(prev => prev.filter(entry => entry.id !== entryId));
    setIsLoading(false);
    
    addToast({
      type: 'info',
      message: 'Entry deleted successfully',
    });
  };

  const getCalendarDays = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getStreakCount = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      if (getEntryForDate(checkDate)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getTotalEntries = () => {
    return entries.length;
  };

  const getCurrentMonthEntries = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    }).length;
  };

  const exportData = () => {
    try {
      const dataStr = JSON.stringify(entries, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gratitude-journal-${format(new Date(), 'yyyy-MM-dd')}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      addToast({
        type: 'success',
        message: 'Data exported successfully! 📁',
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to export data. Please try again.',
      });
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedEntries = JSON.parse(e.target?.result as string);
          setEntries(importedEntries);
          addToast({
            type: 'success',
            message: `${importedEntries.length} entries imported successfully! 📥`,
          });
        } catch (error) {
          addToast({
            type: 'error',
            message: 'Invalid file format. Please select a valid JSON file.',
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const shareEntry = async (entry: JournalEntry) => {
    try {
      const shareText = `One Good Thing - ${format(new Date(entry.date), 'MMMM d, yyyy')}\n\n${entry.content}\n\n#Gratitude #OneGoodThing`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'One Good Thing',
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        addToast({
          type: 'success',
          message: 'Entry copied to clipboard! 📋',
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to share entry. Please try again.',
      });
    }
  };



  const allTags = Array.from(new Set(entries.flatMap(entry => entry.tags || [])));

  const renderCalendar = () => {
    const days = getCalendarDays();
    const firstDay = days[0];
    const startPadding = firstDay.getDay();

    return (
      <div className="calendar">
        <div className="calendar-header">
          <button 
            onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
            className="calendar-nav-btn"
            aria-label="Previous month"
          >
            ‹
          </button>
          <h2 className="calendar-title">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button 
            onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
            className="calendar-nav-btn"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
        
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day: string) => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          
          {Array.from({ length: startPadding }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty"></div>
          ))}
          
          {days.map(day => {
            const entry = getEntryForDate(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                className={`calendar-day ${isSelected ? 'selected' : ''} ${isCurrentDay ? 'today' : ''} ${entry ? 'has-entry' : ''}`}
                onClick={() => setSelectedDate(day)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedDate(day);
                  }
                }}
                aria-label={`${format(day, 'MMMM d, yyyy')}${entry ? ' - Has entry' : ' - No entry'}`}
              >
                <span className="day-number">{format(day, 'd')}</span>
                {entry && <div className="entry-indicator">❤️</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const selectedEntry = getEntryForDate(selectedDate);

  return (
    <div className="App">
      {/* Enhanced Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <div className="logo">
              <Sun className="logo-icon" />
              <h1>One Good Thing</h1>
            </div>
          </div>

          <div className="navbar-center">
            <div className="stats-container">
              <div className="stat-item">
                <Heart className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-value">{getStreakCount()}</span>
                  <span className="stat-label">Day Streak</span>
                </div>
              </div>
              <div className="stat-item">
                <Calendar className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-value">{getTotalEntries()}</span>
                  <span className="stat-label">Total Entries</span>
                </div>
              </div>
              <div className="stat-item">
                <BarChart3 className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-value">{getCurrentMonthEntries()}</span>
                  <span className="stat-label">This Month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="navbar-right">
            <div className="navbar-actions">
              <button 
                className="nav-btn"
                onClick={() => setShowSearch(!showSearch)}
                title="Search entries (Ctrl+/)"
              >
                <Search className="nav-icon" />
              </button>
              
              <button 
                className="nav-btn"
                onClick={() => setDarkMode(!darkMode)}
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="nav-icon" /> : <Moon className="nav-icon" />}
              </button>
              
              <button 
                className="nav-btn"
                onClick={() => setViewMode(viewMode === 'calendar' ? 'bento' : 'calendar')}
                title={`Switch to ${viewMode === 'calendar' ? 'Bento' : 'Calendar'} View`}
              >
                <Grid3X3 className="nav-icon" />
              </button>
              
              <button 
                className="nav-btn"
                onClick={() => setShowEntryModal(true)}
                title="Add New Entry (Ctrl+N)"
              >
                <Plus className="nav-icon" />
              </button>

              <div className="dropdown">
                <button 
                  className="nav-btn dropdown-toggle"
                  onClick={() => setShowNavMenu(!showNavMenu)}
                  title="More Options"
                >
                  <Settings className="nav-icon" />
                </button>
                
                {showNavMenu && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={exportData}>
                      <Download className="dropdown-icon" />
                      Export Data
                    </button>
                    <label className="dropdown-item">
                      <Upload className="dropdown-icon" />
                      Import Data
                      <input 
                        type="file" 
                        accept=".json" 
                        onChange={importData}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item">
                      <Bell className="dropdown-icon" />
                      Set Reminders
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      {showSearch && (
        <div className="search-container">
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search entries or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              autoFocus
            />
            <button 
              onClick={() => setShowSearch(false)}
              className="search-close-btn"
            >
              <X className="search-close-icon" />
            </button>
          </div>
          
          {allTags.length > 0 && (
            <div className="tag-filter">
              <Filter className="filter-icon" />
              <span className="filter-label">Filter by tags:</span>
              <div className="tag-buttons">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    )}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="container">
        <main className="main-content">
          {viewMode === 'calendar' ? (
            <div className="content-grid">
              <div className="calendar-section">
                <div className="section-header">
                  <Calendar className="section-icon" />
                  <h2>Calendar View</h2>
                </div>
                {renderCalendar()}
              </div>

              <div className="entry-section">
                <div className="section-header">
                  <h2>Entry for {format(selectedDate, 'MMMM d, yyyy')}</h2>
                  {!selectedEntry && (
                    <button 
                      onClick={() => setShowEntryModal(true)}
                      className="add-entry-btn"
                    >
                      <Plus className="btn-icon" />
                      Add Entry
                    </button>
                  )}
                </div>

                {selectedEntry ? (
                  <div className="entry-display">
                    <div className="entry-content">
                      <p>{selectedEntry.content}</p>
                      {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                        <div className="entry-tags">
                          {selectedEntry.tags.map(tag => (
                            <span key={tag} className="entry-tag">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="entry-actions">
                      <button 
                        onClick={() => {
                          setEntryText(selectedEntry.content);
                          setEditingEntry(selectedEntry);
                          setShowEntryModal(true);
                        }}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => shareEntry(selectedEntry)}
                        className="share-btn"
                      >
                        <Share2 className="share-icon" />
                        Share
                      </button>
                      <button 
                        onClick={() => deleteEntry(selectedEntry.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="empty-entry">
                    <p>✨ No entry for this day yet</p>
                    <p>Take a moment to reflect on something positive that happened today</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8">
              <GratitudeBento
                totalEntries={getTotalEntries()}
                currentStreak={getStreakCount()}
                thisMonthEntries={getCurrentMonthEntries()}
                onAddEntry={() => setShowEntryModal(true)}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
                isDarkMode={darkMode}
              />
            </div>
          )}
        </main>

        {/* Entry Modal */}
        {showEntryModal && (
          <div className="modal-overlay" onClick={() => setShowEntryModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  {editingEntry ? 'Edit Entry' : 'New Entry'} - {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                <button 
                  onClick={() => setShowEntryModal(false)}
                  className="close-btn"
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="entry-input-container">
                  <textarea
                    value={entryText}
                    onChange={(e) => setEntryText(e.target.value)}
                    placeholder="What's one good thing that happened today? 🌟

Tip: Use #tags to categorize your entries (e.g., #family #work #nature)"
                    className="entry-textarea"
                    rows={6}
                    autoFocus
                    disabled={isLoading}
                  />
                  <div className="entry-input-footer">
                    <div className="input-tips">
                      <span className="tip">💡 Use #tags to organize entries</span>
                      <span className="tip">⌨️ Ctrl+N to add new entry</span>
                    </div>
                    <div className="character-count">
                      {entryText.length}/1000
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  onClick={() => setShowEntryModal(false)}
                  className="cancel-btn"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  onClick={editingEntry ? updateEntry : addEntry}
                  className="save-btn"
                  disabled={!entryText.trim() || isLoading}
                >
                  {isLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <>
                      {editingEntry ? 'Update Entry' : 'Save Entry'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`toast toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
          >
            <div className="toast-icon">
              {toast.type === 'success' && <CheckCircle className="toast-icon-svg" />}
              {toast.type === 'error' && <AlertCircle className="toast-icon-svg" />}
              {toast.type === 'info' && <Info className="toast-icon-svg" />}
            </div>
            <div className="toast-content">
              <span className="toast-message">{toast.message}</span>
            </div>
            <button 
              className="toast-close"
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
            >
              <X className="toast-close-icon" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
