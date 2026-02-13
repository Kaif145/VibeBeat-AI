
import React, { useState } from 'react';
import { Song, Language } from '../types';

interface AdminDashboardProps {
  songs: Song[];
  onUpdateSongs: (songs: Song[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ songs, onUpdateSongs }) => {
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    genre: '',
    vibe: 'happy',
    language: Language.ENGLISH,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://picsum.photos/seed/new/800/1200',
    isTrending: false
  });

  const addSong = () => {
    const song: Song = {
      ...newSong,
      id: Math.random().toString(36).substr(2, 9),
      createdBy: 'admin'
    };
    onUpdateSongs([...songs, song]);
    setNewSong({
      title: '',
      artist: '',
      genre: '',
      vibe: 'happy',
      language: Language.ENGLISH,
      previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      coverUrl: 'https://picsum.photos/seed/' + Math.random() + '/800/1200',
      isTrending: false
    });
  };

  const deleteSong = (id: string) => {
    onUpdateSongs(songs.filter(s => s.id !== id));
  };

  const toggleTrending = (id: string) => {
    onUpdateSongs(songs.map(s => s.id === id ? { ...s, isTrending: !s.isTrending } : s));
  };

  return (
    <div className="h-full overflow-y-auto p-6 md:p-12 max-w-6xl mx-auto space-y-12">
      <h2 className="text-3xl font-bold">Admin Management</h2>

      <section className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl space-y-6">
        <h3 className="text-xl font-bold">Add New Song</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input 
            type="text" placeholder="Title" value={newSong.title}
            onChange={e => setNewSong({...newSong, title: e.target.value})}
            className="bg-black border border-neutral-700 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <input 
            type="text" placeholder="Artist" value={newSong.artist}
            onChange={e => setNewSong({...newSong, artist: e.target.value})}
            className="bg-black border border-neutral-700 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <input 
            type="text" placeholder="Genre" value={newSong.genre}
            onChange={e => setNewSong({...newSong, genre: e.target.value})}
            className="bg-black border border-neutral-700 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <select 
            value={newSong.language}
            onChange={e => setNewSong({...newSong, language: e.target.value as Language})}
            className="bg-black border border-neutral-700 rounded-xl p-3 focus:outline-none"
          >
            {Object.values(Language).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select 
            value={newSong.vibe}
            onChange={e => setNewSong({...newSong, vibe: e.target.value})}
            className="bg-black border border-neutral-700 rounded-xl p-3 focus:outline-none"
          >
            {['happy', 'sad', 'romantic', 'gym', 'travel', 'aesthetic', 'party'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <div className="flex items-center gap-2 px-2">
            <input 
              type="checkbox" checked={newSong.isTrending}
              onChange={e => setNewSong({...newSong, isTrending: e.target.checked})}
              className="w-5 h-5 accent-purple-500"
            />
            <span>Mark as Trending</span>
          </div>
        </div>
        <button 
          onClick={addSong}
          className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition"
        >
          Upload Song
        </button>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold">Manage Tracks ({songs.length})</h3>
        <div className="grid gap-3">
          {songs.map(song => (
            <div key={song.id} className="flex items-center justify-between bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800">
              <div className="flex items-center gap-4">
                <img src={song.coverUrl} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <h4 className="font-bold">{song.title}</h4>
                  <p className="text-sm text-gray-400">{song.artist} • {song.language}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleTrending(song.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${song.isTrending ? 'bg-orange-500 text-black' : 'bg-neutral-800 text-gray-500'}`}
                >
                  {song.isTrending ? 'Trending' : 'Normal'}
                </button>
                <button 
                  onClick={() => deleteSong(song.id)}
                  className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
