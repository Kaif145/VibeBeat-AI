
import React from 'react';
import { Song } from '../types';
import { Play, Music2, Sparkles, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SavedSongsProps {
  songs: Song[];
  onGoToReels: () => void;
}

const SavedSongs: React.FC<SavedSongsProps> = ({ songs, onGoToReels }) => {
  return (
    <div className="h-full overflow-y-auto p-6 md:p-12 max-w-6xl mx-auto space-y-12 pb-24">
      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2"
      >
        <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Your Collection</h2>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Discovered Vibes & Favorites</p>
      </motion.header>

      {songs.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-neutral-900/30 border border-neutral-800 rounded-[40px] p-16 md:p-24 text-center space-y-8 flex flex-col items-center justify-center"
        >
          <div className="w-24 h-24 bg-neutral-800 rounded-3xl flex items-center justify-center text-5xl">
            <Music2 className="w-12 h-12 text-neutral-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black uppercase tracking-tight">Your library is silent</h3>
            <p className="text-gray-500 max-w-sm mx-auto font-medium">Use AI on the Dashboard to find tracks that match your mood or aesthetic.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGoToReels}
            className="bg-white text-black font-black py-5 px-12 rounded-full hover:bg-purple-500 hover:text-white transition-all uppercase tracking-widest text-[10px] shadow-xl"
          >
            Go Discover Music
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {songs.map((song, i) => (
            <motion.div 
              key={song.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group cursor-pointer space-y-4"
            >
              <div className="aspect-square rounded-[32px] overflow-hidden relative shadow-2xl border border-white/5">
                <img src={song.coverUrl} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt={song.title} />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={`https://open.spotify.com/search/${encodeURIComponent(song.title + ' ' + song.artist)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-black p-5 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <Play className="w-7 h-7 fill-current" />
                  </motion.a>
                </div>
                {song.createdBy === 'ai' && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-purple-600/90 backdrop-blur-md text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/10 flex items-center gap-1">
                      <Sparkles className="w-2 h-2" />
                      AI Discover
                    </span>
                  </div>
                )}
              </div>
              <div className="px-1 space-y-0.5">
                <h4 className="font-black text-lg truncate group-hover:text-purple-400 transition-colors uppercase tracking-tight">{song.title}</h4>
                <p className="text-xs font-bold text-gray-500 truncate uppercase tracking-widest">{song.artist}</p>
                <div className="flex gap-2 mt-2">
                    <span className="text-[8px] font-black uppercase tracking-tighter text-neutral-600">#{song.genre}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSongs;
