
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, UserRole, Song, Language, AIRecommendation } from './types';
import { INITIAL_SONGS } from './constants';
import { analyzeMood, analyzePhoto } from './services/geminiService';

// Components
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import SavedSongs from './components/SavedSongs';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
  const [currentView, setCurrentView] = useState<'dashboard' | 'admin' | 'saved'>('dashboard');
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AIRecommendation | null>(null);
  const [analysisSource, setAnalysisSource] = useState<'mood' | 'photo' | null>(null);

  // 1. Initial Load: Only on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('vibeBeat_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedCustomSongs = localStorage.getItem('vibeBeat_custom_songs');
    if (savedCustomSongs) {
      const customSongs: Song[] = JSON.parse(savedCustomSongs);
      setSongs(prev => {
        const existingIds = new Set(prev.map(s => s.id));
        const uniqueCustom = customSongs.filter(s => !existingIds.has(s.id));
        return [...prev, ...uniqueCustom];
      });
    }
  }, []);

  // 2. Spotify Message Listener: Use functional update to avoid dependency loop
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SPOTIFY_AUTH_SUCCESS') {
        const { accessToken } = event.data.payload;
        setUser(prev => {
          if (!prev) return null;
          const updatedUser = { ...prev, spotifyToken: accessToken };
          localStorage.setItem('vibeBeat_user', JSON.stringify(updatedUser));
          return updatedUser;
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleAuth = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('vibeBeat_user', JSON.stringify(loggedInUser));
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('vibeBeat_user');
    setCurrentView('dashboard');
    setCurrentAnalysis(null);
    setAnalysisSource(null);
  }, []);

  const toggleLike = useCallback((songId: string) => {
    setUser(prev => {
      if (!prev) return null;
      const isLiked = prev.likedSongs.includes(songId);
      const updatedUser = {
        ...prev,
        likedSongs: isLiked 
          ? prev.likedSongs.filter(id => id !== songId) 
          : [...prev.likedSongs, songId]
      };
      localStorage.setItem('vibeBeat_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const toggleSave = useCallback((songId: string, songData?: Song) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      
      const isSaved = prevUser.savedSongs.includes(songId);

      // LOGIC FIX: If saving an AI track, we must register it in the master 'songs' list
      if (!isSaved && (songId.startsWith('ai-') || songData)) {
        setSongs(prevSongs => {
          if (prevSongs.find(s => s.id === songId)) return prevSongs;
          
          let newSong: Song | undefined = songData;

          if (!newSong && songId.startsWith('ai-')) {
            const aiTrack = currentAnalysis?.recommendedTracks.find(t => 
              `ai-${t.title}-${t.artist}`.replace(/\s+/g, '-').toLowerCase() === songId
            );

            if (aiTrack) {
              newSong = {
                id: songId,
                title: aiTrack.title,
                artist: aiTrack.artist,
                genre: aiTrack.tags[0] || 'Discovery',
                vibe: currentAnalysis?.vibe || 'AI Mix',
                language: Language.MIX,
                previewUrl: aiTrack.previewUrl || '', 
                coverUrl: `https://picsum.photos/seed/${songId}/800/1200`,
                isTrending: false,
                createdBy: 'ai',
                spotifyId: aiTrack.spotifyId,
                lyricsSnippet: aiTrack.lyricsSnippet
              };
            }
          }

          if (newSong) {
            const updatedSongs = [...prevSongs, newSong];
            // Persist only the AI discovered songs to local storage
            const customOnly = updatedSongs.filter(s => s.createdBy === 'ai');
            localStorage.setItem('vibeBeat_custom_songs', JSON.stringify(customOnly));
            return updatedSongs;
          }
          return prevSongs;
        });
      }

      const updatedUser = {
        ...prevUser,
        savedSongs: isSaved 
          ? prevUser.savedSongs.filter(id => id !== songId) 
          : [...prevUser.savedSongs, songId]
      };
      localStorage.setItem('vibeBeat_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, [currentAnalysis]);

  const onMoodSubmit = useCallback(async (mood: string, prefLanguage: Language) => {
    setIsLoading(true);
    try {
      const analysis = await analyzeMood(mood, prefLanguage);
      setCurrentAnalysis(analysis);
      setAnalysisSource('mood');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onPhotoSubmit = useCallback(async (base64: string, prefLanguage: Language) => {
    setIsLoading(true);
    try {
      const analysis = await analyzePhoto(base64, prefLanguage);
      setCurrentAnalysis(analysis);
      setAnalysisSource('photo');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNavigate = useCallback((view: 'dashboard' | 'admin' | 'saved') => {
    setCurrentView(view);
    if (view !== 'dashboard') {
      setCurrentAnalysis(null);
      setAnalysisSource(null);
    }
  }, []);

  const trendingSongs = useMemo(() => 
    songs.filter(s => s.isTrending || s.createdBy === 'admin'),
  [songs]);

  const userSavedSongs = useMemo(() => {
    if (!user) return [];
    return songs.filter(s => user.savedSongs.includes(s.id));
  }, [songs, user?.savedSongs]);

  if (!user) {
    return <AuthPage onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        currentView={currentView} 
        onNavigate={handleNavigate} 
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

        {currentView === 'admin' && user.role === UserRole.ADMIN && (
          <AdminDashboard 
            songs={songs} 
            onUpdateSongs={setSongs} 
          />
        )}

        {currentView === 'saved' && (
          <SavedSongs 
            songs={userSavedSongs} 
            onGoToReels={() => setCurrentView('dashboard')}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
