
import React, { useState } from 'react';
import { Language, AIRecommendation, User } from '../types';
import { ChevronLeft, Info, Bookmark, Play, RefreshCw, Camera, Music2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  user: User;
  onMoodSubmit: (mood: string, lang: Language) => void;
  onPhotoSubmit: (base64: string, lang: Language) => void;
  analysis: AIRecommendation | null;
  analysisSource: 'mood' | 'photo' | null;
  onClearAnalysis: () => void;
  onSaveTrack: (songId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onMoodSubmit, onPhotoSubmit, analysis, analysisSource, onClearAnalysis, onSaveTrack }) => {
  const [mood, setMood] = useState('');
  const [prefLanguage, setPrefLanguage] = useState<Language>(Language.MIX);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMoodSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mood.trim()) {
      onMoodSubmit(mood, prefLanguage);
    }
  };

  const handlePhotoSearch = () => {
    if (imagePreview) {
      onPhotoSubmit(imagePreview, prefLanguage);
    }
  };

  const isSaved = (title: string, artist: string) => {
    const virtualId = `ai-${title}-${artist}`.replace(/\s+/g, '-').toLowerCase();
    return user.savedSongs.includes(virtualId);
  };

  const handleSaveAIRecommendation = (title: string, artist: string) => {
    const virtualId = `ai-${title}-${artist}`.replace(/\s+/g, '-').toLowerCase();
    onSaveTrack(virtualId);
  };

  if (analysis) {
    const displayLabel = analysisSource === 'photo' ? 'Photo Analysis' : 'Mood Analysis';
    const sourceSummary = analysisSource === 'photo' ? 'Image Context' : 'Mood Context';

    return (
      <div className="h-full overflow-y-auto bg-neutral-50 px-4 md:px-12 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
          <div className="flex items-center justify-between">
            <motion.button 
              whileHover={{ x: -5 }}
              onClick={onClearAnalysis}
              className="text-neutral-900 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:opacity-70 transition-all"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={3} />
              Go Back
            </motion.button>
            <div className="text-center">
              <h2 className="text-neutral-900 text-xl font-black uppercase tracking-tighter">{displayLabel}</h2>
              <div className="h-1 w-8 bg-purple-500 mx-auto mt-1 rounded-full"></div>
            </div>
            <div className="w-[60px]"></div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-neutral-200 rounded-[40px] p-6 md:p-8 shadow-sm flex flex-col items-center gap-6 overflow-hidden"
          >
            {analysisSource === 'photo' && imagePreview ? (
              <img src={imagePreview} alt="Target Vibe" className="w-full max-h-72 object-cover rounded-3xl shadow-lg" />
            ) : (
              <div className="w-full p-10 bg-gradient-to-br from-indigo-50 to-purple-50 border border-purple-100 rounded-3xl text-center">
                <div className="text-4xl mb-4">🎵</div>
                <p className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-2">Original Mood Description</p>
                <p className="text-neutral-800 text-lg md:text-xl font-medium italic leading-relaxed">"{mood}"</p>
              </div>
            )}
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFullAnalysis(!showFullAnalysis)}
              className="bg-black text-white font-black py-4 px-10 rounded-full flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-black/10 uppercase tracking-widest text-xs"
            >
              <Info className="w-4 h-4" />
              {showFullAnalysis ? "Hide" : "View"} {sourceSummary}
            </motion.button>
            
            <AnimatePresence>
              {showFullAnalysis && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="w-full px-4 border-t border-neutral-100 pt-6 overflow-hidden"
                >
                  <div className="text-center max-w-xl mx-auto space-y-3">
                    <p className="font-black text-[10px] uppercase text-neutral-400 tracking-[0.3em]">AI Vibe Assessment</p>
                    <p className="text-2xl font-black text-neutral-900 leading-tight">Mood: <span className="text-purple-600 uppercase">{analysis.vibe}</span></p>
                    <p className="text-neutral-500 text-sm md:text-base leading-relaxed">{analysis.description}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 px-2">
              <h3 className="text-neutral-400 font-black uppercase tracking-[0.2em] text-[10px] whitespace-nowrap">
                Song Matches ({analysis.recommendedTracks.length})
              </h3>
              <div className="flex-1 h-[1px] bg-neutral-200"></div>
            </div>
            
            {analysis.recommendedTracks.map((track, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-neutral-200 rounded-[40px] p-6 md:p-10 shadow-sm space-y-6 hover:border-purple-300 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-neutral-900 text-2xl md:text-4xl font-black tracking-tighter leading-none group-hover:text-purple-600 transition-colors">{track.title}</h4>
                    <p className="text-neutral-400 text-lg md:text-xl font-bold italic">by {track.artist}</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSaveAIRecommendation(track.title, track.artist)}
                    className={`shrink-0 p-4 rounded-full transition-all duration-300 border flex items-center justify-center ${
                      isSaved(track.title, track.artist)
                        ? 'bg-purple-600 border-purple-600 text-white shadow-xl shadow-purple-500/30'
                        : 'bg-neutral-50 border-neutral-100 text-neutral-300 hover:border-purple-200 hover:text-purple-500 hover:bg-white'
                    }`}
                  >
                    <Bookmark className="w-6 h-6" fill={isSaved(track.title, track.artist) ? "currentColor" : "none"} />
                  </motion.button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {track.tags.map((tag) => (
                    <span key={tag} className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-neutral-100 text-neutral-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="bg-neutral-50/80 p-6 rounded-3xl border border-neutral-100/50">
                    <p className="text-neutral-500 leading-relaxed italic text-sm md:text-base font-medium">
                    "{track.whyMatch}"
                    </p>
                </div>

                <div className="pt-2">
                  <motion.a 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`https://open.spotify.com/search/${encodeURIComponent(track.title + ' ' + track.artist)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#1DB954] text-white font-black py-5 px-8 rounded-full flex items-center justify-center gap-4 hover:bg-[#1ed760] transition-all shadow-xl shadow-green-500/10 uppercase tracking-widest text-xs"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Full Stream on Spotify
                  </motion.a>
                </div>
              </motion.div>
            ))}

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                if (analysisSource === 'photo') {
                    onPhotoSubmit(imagePreview!, prefLanguage);
                } else {
                    onMoodSubmit(mood || "more songs like this deeper analysis", prefLanguage);
                }
              }}
              className="w-full py-12 border-2 border-dashed border-neutral-200 rounded-[40px] text-neutral-300 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white hover:border-purple-300 hover:text-purple-500 transition-all duration-700 bg-neutral-50/30"
            >
              <RefreshCw className="w-4 h-4 mx-auto mb-2" />
              Want more music? Refresh AI Deep Dive.
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 md:p-12 max-w-5xl mx-auto space-y-12 pb-24">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-2xl mx-auto"
      >
        <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-700">
          Sync Your Soul
        </h2>
        <p className="text-gray-500 text-sm md:text-lg font-bold uppercase tracking-[0.2em]">
          AI-Powered Visual & Emotional Audio Discovery
        </p>
      </motion.header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Mood Section */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-neutral-900/50 border border-neutral-800 p-8 md:p-10 rounded-[40px] space-y-8 hover:border-purple-500/50 transition-all group relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition">
              <Search className="text-purple-400 w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter">Describe Mood</h3>
          </div>
          
          <form onSubmit={handleMoodSearch} className="space-y-6 relative z-10">
            <textarea
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="How does today feel? Describe your setting, your emotions, or a specific memory..."
              className="w-full h-40 bg-black/50 border border-neutral-700 rounded-3xl p-5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none font-medium leading-relaxed shadow-inner"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!mood.trim()}
              className="w-full bg-white text-black font-black py-5 rounded-full hover:bg-purple-500 hover:text-white transition-all disabled:opacity-20 uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-white/5"
            >
              Analyze Mood
            </motion.button>
          </form>
        </motion.section>

        {/* Photo Section */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-neutral-900/50 border border-neutral-800 p-8 md:p-10 rounded-[40px] space-y-8 hover:border-blue-500/50 transition-all group relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition">
              <Camera className="text-blue-400 w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter">Visual Vibe</h3>
          </div>

          <div className="space-y-6 relative z-10">
            <label className="block w-full h-40 border-2 border-dashed border-neutral-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all overflow-hidden group/upload">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" />
              ) : (
                <div className="text-center p-4">
                  <Camera className="w-10 h-10 text-neutral-700 mx-auto mb-2 group-hover/upload:text-blue-500 transition" />
                  <span className="text-neutral-600 font-black uppercase tracking-widest text-[10px] block">Click to Upload Image</span>
                  <span className="text-[10px] text-neutral-700 mt-2 block font-medium">Aesthetic Photo → Perfect Playlist</span>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePhotoSearch}
              disabled={!imagePreview}
              className="w-full bg-blue-500 text-white font-black py-5 rounded-full hover:bg-blue-600 transition-all disabled:opacity-20 uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-blue-500/10"
            >
              Analyze Aesthetic
            </motion.button>
          </div>
        </motion.section>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center space-y-6 pt-8 pb-12"
      >
        <p className="text-neutral-500 font-black uppercase tracking-[0.3em] text-[10px]">Filter Discovery</p>
        <div className="flex flex-wrap justify-center gap-3">
          {Object.values(Language).map((lang) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={lang}
              onClick={() => setPrefLanguage(lang)}
              className={`px-8 py-3 rounded-full border transition-all text-[10px] font-black uppercase tracking-widest ${
                prefLanguage === lang 
                  ? 'bg-white text-black border-white shadow-2xl shadow-white/20 scale-105' 
                  : 'bg-transparent text-neutral-600 border-neutral-800 hover:border-neutral-500 hover:text-neutral-300'
              }`}
            >
              {lang}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
