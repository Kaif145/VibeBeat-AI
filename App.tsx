
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

  // Initial Load: User and Custom Discovered Songs
  useEffect(() => {
    const savedUser = localStorage.getItem('vibeBeat_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedCustomSongs = localStorage.getItem('vibeBeat_custom_songs');
    if (savedCustomSongs) {
      const customSongs: Song[] = JSON.parse(savedCustomSongs);
      setSongs(prev => {
        // Only add songs that don't already exist in the list
        const existingIds = new Set(prev.map(s => s.id));
        const uniqueCustom = customSongs.filter(s => !existingIds.has(s.id));
        return [...prev, ...uniqueCustom];
      });
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

    // LOGIC FIX: If saving an AI track, we must register it in the master 'songs' list
    if (!isSaved && songId.startsWith('ai-') && !songs.find(s => s.id === songId)) {
      const aiTrack = currentAnalysis?.recommendedTracks.find(t => 
        `ai-${t.title}-${t.artist}`.replace(/\s+/g, '-').toLowerCase() === songId
      );

      if (aiTrack) {
        const newSong: Song = {
          id: songId,
          title: aiTrack.title,
          artist: aiTrack.artist,
          genre: aiTrack.tags[0] || 'Discovery',
          vibe: currentAnalysis?.vibe || 'AI Mix',
          language: Language.MIX,
          previewUrl: '', // No preview for AI suggested tracks
          coverUrl: `https://picsum.photos/seed/${songId}/800/1200`,
          isTrending: false,
          createdBy: 'ai'
        };
        
        const updatedSongs = [...songs, newSong];
        setSongs(updatedSongs);
        
        // Persist only the AI discovered songs to local storage
        const customOnly = updatedSongs.filter(s => s.createdBy === 'ai');
        localStorage.setItem('vibeBeat_custom_songs', JSON.stringify(customOnly));
      }
    }

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
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-2xl font-black uppercase tracking-widest text-purple-400">Tuning to your soul...</p>
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
            songs={songs.filter(s => s.isTrending || s.createdBy === 'admin')} 
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
            onGoToReels={() => setCurrentView('dashboard')}
          />
        )}
      </main>
    </div>
  );
};

export default App;
