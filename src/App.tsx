import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { Plus, Heart, Calendar, Sun } from 'lucide-react';
import './App.css';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  timestamp: number;
}

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [entryText, setEntryText] = useState('');

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('oneGoodThingEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('oneGoodThingEntries', JSON.stringify(entries));
  }, [entries]);

  const getEntryForDate = (date: Date) => {
    return entries.find(entry => isSameDay(new Date(entry.date), date));
  };

  const addEntry = () => {
    if (entryText.trim()) {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: selectedDate.toISOString().split('T')[0],
        content: entryText.trim(),
        timestamp: Date.now(),
      };
      setEntries(prev => [...prev, newEntry]);
      setEntryText('');
      setShowEntryModal(false);
    }
  };



  const deleteEntry = (entryId: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
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
          >
            ‹
          </button>
          <h2 className="calendar-title">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button 
            onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
            className="calendar-nav-btn"
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
      <div className="container">
        <header className="app-header">
          <div className="header-content">
            <div className="logo">
              <Sun className="logo-icon" />
              <h1>One Good Thing</h1>
            </div>
            <div className="streak-counter">
              <Heart className="streak-icon" />
              <span>{getStreakCount()} day streak</span>
            </div>
          </div>
        </header>

        <main className="main-content">
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
                  </div>
                  <div className="entry-actions">
                    <button 
                      onClick={() => {
                        setEntryText(selectedEntry.content);
                        setShowEntryModal(true);
                      }}
                      className="edit-btn"
                    >
                      Edit
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
                  <p>No entry for this day yet.</p>
                  <p>Click "Add Entry" to log one good thing that happened today!</p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Entry Modal */}
        {showEntryModal && (
          <div className="modal-overlay" onClick={() => setShowEntryModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>One Good Thing - {format(selectedDate, 'MMMM d, yyyy')}</h3>
                <button 
                  onClick={() => setShowEntryModal(false)}
                  className="close-btn"
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <textarea
                  value={entryText}
                  onChange={(e) => setEntryText(e.target.value)}
                  placeholder="What's one good thing that happened today?"
                  className="entry-textarea"
                  rows={4}
                  autoFocus
                />
              </div>
              <div className="modal-footer">
                <button 
                  onClick={() => setShowEntryModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  onClick={addEntry}
                  className="save-btn"
                  disabled={!entryText.trim()}
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
