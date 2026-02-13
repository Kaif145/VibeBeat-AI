
import React from 'react';
import { Song } from '../types';

interface SavedSongsProps {
  songs: Song[];
  onGoToReels: () => void;
}

const SavedSongs: React.FC<SavedSongsProps> = ({ songs, onGoToReels }) => {
  return (
    <div className="h-full overflow-y-auto p-6 md:p-12 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-4xl font-black">Your Collection</h2>
        <p className="text-gray-400">Songs you've bookmarked for later.</p>
      </div>

      {songs.length === 0 ? (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-12 text-center space-y-6">
          <div className="text-6xl">🎵</div>
          <h3 className="text-xl font-bold">Your library is empty</h3>
          <p className="text-gray-500 max-w-xs mx-auto">Start discovering music by describing your mood on the dashboard.</p>
          <button 
            onClick={onGoToReels}
            className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition"
          >
            Start Discovering
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {songs.map(song => (
            <div key={song.id} className="group cursor-pointer">
              <div className="aspect-square rounded-2xl overflow-hidden mb-3 relative">
                <img src={song.coverUrl} className="w-full h-full object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button className="bg-white text-black p-3 rounded-full shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </button>
                </div>
              </div>
              <h4 className="font-bold truncate">{song.title}</h4>
              <p className="text-sm text-gray-500 truncate">{song.artist}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSongs;
