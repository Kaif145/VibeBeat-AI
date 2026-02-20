
import React, { useState, useRef } from 'react';
import { Song, User } from '../types';
import { Heart, Bookmark, ExternalLink, Music2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReelsFeedProps {
  songs: Song[];
  user: User;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}

const SpotifyEmbed: React.FC<{ song: Song }> = ({ song }) => {
  const embedUrl = song.spotifyId 
    ? `https://open.spotify.com/embed/track/${song.spotifyId}?utm_source=generator&theme=0`
    : `https://open.spotify.com/embed/track/4cOdK2wGqyZdyvY3pUQN09?utm_source=generator&theme=0`;
  
  return (
    <div className="w-full h-20 md:h-80 rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl">
      <iframe 
        src={embedUrl}
        width="100%" 
        height="100%" 
        frameBorder="0" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"
        className="opacity-90 hover:opacity-100 transition"
      ></iframe>
    </div>
  );
};

const ReelsFeed: React.FC<ReelsFeedProps> = ({ songs, user, onLike, onSave }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const index = Math.round(container.scrollTop / container.clientHeight);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <div 
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-[calc(100vh-73px)] w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black"
    >
      {songs.map((song, idx) => (
        <div key={song.id} className="h-full w-full snap-start relative flex flex-col md:flex-row items-center justify-center overflow-hidden">
          {/* Background Layer */}
          <div className="absolute inset-0 z-0">
            <motion.img 
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: activeIndex === idx ? 1.1 : 1.2, opacity: activeIndex === idx ? 0.4 : 0 }}
              transition={{ duration: 1.5 }}
              src={song.coverUrl} 
              alt={song.title} 
              className="w-full h-full object-cover blur-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
          </div>

          {/* Content Layer */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: activeIndex === idx ? 1 : 0, y: activeIndex === idx ? 0 : 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-center justify-center p-6 gap-8 md:gap-16"
          >
            
            {/* Left: Spotify & Artwork */}
            <div className="w-full max-w-sm flex flex-col gap-6">
              <motion.div 
                whileHover={{ scale: 1.02, rotate: 2 }}
                className="aspect-square rounded-3xl shadow-2xl overflow-hidden border border-white/10 group relative"
              >
                <img 
                  src={song.coverUrl} 
                  alt={song.title} 
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              </motion.div>
              
              <SpotifyEmbed song={song} />
            </div>

            {/* Right: Info & Actions */}
            <div className="w-full max-w-lg space-y-8 text-center md:text-left">
              <div className="space-y-4">
                <AnimatePresence>
                  {song.isTrending && (
                    <motion.span 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-2 shadow-lg shadow-purple-500/20"
                    >
                      <Sparkles className="w-3 h-3" />
                      Trending
                    </motion.span>
                  )}
                </AnimatePresence>
                <h2 className="text-5xl md:text-8xl font-black leading-none uppercase tracking-tighter break-words bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
                  {song.title}
                </h2>
                <p className="text-2xl md:text-4xl text-purple-400 font-medium tracking-tight italic">
                  {song.artist}
                </p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {[song.genre, song.vibe, song.language].map((tag) => (
                  <span key={tag} className="px-5 py-2 bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-center md:justify-start gap-4 pt-6">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onLike(song.id)}
                  className={`p-5 rounded-full transition-all duration-300 flex items-center justify-center border ${
                    user.likedSongs.includes(song.id) 
                      ? 'bg-pink-500 border-pink-500 text-white shadow-xl shadow-pink-500/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  <Heart className="w-8 h-8" fill={user.likedSongs.includes(song.id) ? "currentColor" : "none"} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onSave(song.id)}
                  className={`p-5 rounded-full transition-all duration-300 flex items-center justify-center border ${
                    user.savedSongs.includes(song.id) 
                      ? 'bg-purple-500 border-purple-500 text-white shadow-xl shadow-purple-500/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  <Bookmark className="w-8 h-8" fill={user.savedSongs.includes(song.id) ? "currentColor" : "none"} />
                </motion.button>
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`https://open.spotify.com/search/${encodeURIComponent(song.title + ' ' + song.artist)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white text-black font-black py-5 rounded-full hover:bg-gray-200 transition uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-white/5"
                >
                  <ExternalLink className="w-4 h-4" />
                  Listen Full
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default ReelsFeed;
