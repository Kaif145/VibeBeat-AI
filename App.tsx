
import React, { useState, useEffect } from 'react';
import { User, UserRole, Song, Language, AIRecommendation } from './types';
import { INITIAL_SONGS } from './constants';
import { analyzeMood, analyzePhoto } from './services/geminiService';

// Components
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import ReelsFeed from './components/ReelsFeed';
import AdminDashboard from './components/AdminDashboard';
import SavedSongs from './components/SavedSongs';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
  const [currentView, setCurrentView] = useState<'dashboard' | 'reels' | 'admin' | 'saved'>('dashboard');
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AIRecommendation | null>(null);
  const [analysisSource, setAnalysisSource] = useState<'mood' | 'photo' | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('vibeBeat_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuth = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('vibeBeat_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('vibeBeat_user');
    setCurrentView('dashboard');
    setCurrentAnalysis(null);
    setAnalysisSource(null);
  };

  const toggleLike = (songId: string) => {
    if (!user) return;
    const isLiked = user.likedSongs.includes(songId);
    const updatedUser = {
      ...user,
      likedSongs: isLiked 
        ? user.likedSongs.filter(id => id !== songId) 
        : [...user.likedSongs, songId]
    };
    setUser(updatedUser);
    localStorage.setItem('vibeBeat_user', JSON.stringify(updatedUser));
  };

  const toggleSave = (songId: string) => {
    if (!user) return;
    const isSaved = user.savedSongs.includes(songId);
    const updatedUser = {
      ...user,
      savedSongs: isSaved 
        ? user.savedSongs.filter(id => id !== songId) 
        : [...user.savedSongs, songId]
    };
    setUser(updatedUser);
    localStorage.setItem('vibeBeat_user', JSON.stringify(updatedUser));
  };

  const onMoodSubmit = async (mood: string, prefLanguage: Language) => {
    setIsLoading(true);
    try {
      const analysis = await analyzeMood(mood);
      setCurrentAnalysis(analysis);
      setAnalysisSource('mood');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onPhotoSubmit = async (base64: string, prefLanguage: Language) => {
    setIsLoading(true);
    try {
      const analysis = await analyzePhoto(base64);
      setCurrentAnalysis(analysis);
      setAnalysisSource('photo');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <AuthPage onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        currentView={currentView} 
        onNavigate={(view) => {
          setCurrentView(view);
          if (view !== 'dashboard') {
            setCurrentAnalysis(null);
            setAnalysisSource(null);
          }
        }} 
      />
      
      <main className="flex-1 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-medium">AI is feeling your vibe...</p>
          </div>
        )}

        {currentView === 'dashboard' && (
          <Dashboard 
            user={user}
            onMoodSubmit={onMoodSubmit} 
            onPhotoSubmit={onPhotoSubmit}
            analysis={currentAnalysis}
            analysisSource={analysisSource}
            onClearAnalysis={() => {
                setCurrentAnalysis(null);
                setAnalysisSource(null);
            }}
            onSaveTrack={toggleSave}
          />
        )}

        {currentView === 'reels' && (
          <ReelsFeed 
            songs={recommendedSongs.length > 0 ? recommendedSongs : songs} 
            user={user}
            onLike={toggleLike}
            onSave={toggleSave}
          />
        )}

        {currentView === 'admin' && user.role === UserRole.ADMIN && (
          <AdminDashboard 
            songs={songs} 
            onUpdateSongs={setSongs} 
          />
        )}

        {currentView === 'saved' && (
          <SavedSongs 
            songs={songs.filter(s => user.savedSongs.includes(s.id))} 
            onGoToReels={() => setCurrentView('reels')}
          />
        )}
      </main>
    </div>
  );
};

export default App;
