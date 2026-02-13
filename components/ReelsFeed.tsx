
import React, { useState, useRef, useEffect } from 'react';
import { Song, User } from '../types';

interface ReelsFeedProps {
  songs: Song[];
  user: User;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}

const SpotifyEmbed: React.FC<{ song: Song }> = ({ song }) => {
  // Use a fallback search if no specific Spotify ID is provided
  // In a production app, you'd use the Spotify Search API to get the exact ID.
  const query = encodeURIComponent(`${song.title} ${song.artist}`);
  const embedUrl = song.spotifyId 
    ? `https://open.spotify.com/embed/track/${song.spotifyId}?utm_source=generator&theme=0`
    : `https://open.spotify.com/embed/track/4cOdK2wGqyZdyvY3pUQN09?utm_source=generator&theme=0`; // Example ID fallback
  
  return (
    <div className="w-full h-20 md:h-80 rounded-xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl">
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
        <div key={song.id} className="h-full w-full snap-start relative flex flex-col md:flex-row items-center justify-center">
          {/* Background Layer */}
          <div className="absolute inset-0 z-0">
            <img 
              src={song.coverUrl} 
              alt={song.title} 
              className="w-full h-full object-cover opacity-40 blur-2xl scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
          </div>

          {/* Content Layer */}
          <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-center justify-center p-6 gap-8 md:gap-16">
            
            {/* Left: Spotify & Artwork */}
            <div className="w-full max-w-sm flex flex-col gap-4">
              <div className="aspect-square rounded-2xl shadow-2xl overflow-hidden border border-white/10 group relative">
                <img 
                  src={song.coverUrl} 
                  alt={song.title} 
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110" 
                />
              </div>
              
              {/* Actual Spotify Embed Player */}
              <SpotifyEmbed song={song} />
            </div>

            {/* Right: Info & Actions */}
            <div className="w-full max-w-lg space-y-6 text-center md:text-left">
              <div className="space-y-2">
                {song.isTrending && (
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-2">
                    Trending
                  </span>
                )}
                <h2 className="text-4xl md:text-7xl font-black leading-none uppercase tracking-tighter break-words">
                  {song.title}
                </h2>
                <p className="text-xl md:text-3xl text-purple-400 font-medium tracking-tight">
                  {song.artist}
                </p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-4 py-1.5 bg-neutral-900/80 backdrop-blur border border-white/5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-300">
                  #{song.genre}
                </span>
                <span className="px-4 py-1.5 bg-neutral-900/80 backdrop-blur border border-white/5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-300">
                  #{song.vibe}
                </span>
                <span className="px-4 py-1.5 bg-neutral-900/80 backdrop-blur border border-white/5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-300">
                  {song.language}
                </span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                <button 
                  onClick={() => onLike(song.id)}
                  className={`p-4 rounded-full transition-all duration-300 flex items-center justify-center border ${
                    user.likedSongs.includes(song.id) 
                      ? 'bg-pink-500 border-pink-500 text-white scale-110 shadow-lg shadow-pink-500/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill={user.likedSongs.includes(song.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button 
                  onClick={() => onSave(song.id)}
                  className={`p-4 rounded-full transition-all duration-300 flex items-center justify-center border ${
                    user.savedSongs.includes(song.id) 
                      ? 'bg-purple-500 border-purple-500 text-white scale-110 shadow-lg shadow-purple-500/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill={user.savedSongs.includes(song.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
                <a 
                  href={`https://open.spotify.com/search/${encodeURIComponent(song.title + ' ' + song.artist)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white text-black font-black py-4 rounded-full hover:bg-gray-200 transition uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.308c-.217.354-.678.468-1.031.251-2.863-1.748-6.466-2.144-10.71-1.176-.404.093-.811-.161-.904-.565s.161-.811.565-.904c4.646-1.057 8.625-.6 11.83 1.357.353.216.467.677.25 1.037zm1.467-3.268c-.273.444-.852.585-1.296.311-3.276-2.013-8.271-2.597-12.146-1.421-.502.152-1.033-.131-1.185-.633-.153-.502.131-1.033.633-1.185 4.417-1.34 9.913-.687 13.682 1.628.444.273.585.852.312 1.3zm.126-3.411c-3.928-2.333-10.414-2.55-14.195-1.401-.602.183-1.238-.163-1.421-.765-.183-.602.163-1.238.765-1.421 4.34-1.319 11.503-1.063 16.02 1.618.541.321.716 1.018.395 1.559-.321.541-1.018.716-1.564.394z"/></svg>
                  Listen Full
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReelsFeed;
