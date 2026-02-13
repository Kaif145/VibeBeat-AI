
import React from 'react';
import { Language, Song } from './types';

export const INITIAL_SONGS: Song[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Luna Eclipse',
    genre: 'Synthwave',
    vibe: 'aesthetic',
    language: Language.ENGLISH,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://picsum.photos/seed/music1/800/1200',
    isTrending: true,
    createdBy: 'admin'
  },
  {
    id: '2',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh',
    genre: 'Romantic',
    vibe: 'romantic',
    language: Language.HINDI,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://picsum.photos/seed/music2/800/1200',
    isTrending: false,
    createdBy: 'admin'
  },
  {
    id: '3',
    title: 'Urban Jungle',
    artist: 'Rhythm Master',
    genre: 'Hip Hop',
    vibe: 'gym',
    language: Language.ENGLISH,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: 'https://picsum.photos/seed/music3/800/1200',
    isTrending: true,
    createdBy: 'admin'
  },
  {
    id: '4',
    title: 'Mon Majhe',
    artist: 'Shreya Ghoshal',
    genre: 'Folk Pop',
    vibe: 'sad',
    language: Language.BENGALI,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverUrl: 'https://picsum.photos/seed/music4/800/1200',
    isTrending: false,
    createdBy: 'admin'
  },
  {
    id: '5',
    title: 'Gaddi Chaddi',
    artist: 'Diljit Dosanjh',
    genre: 'Bhangra',
    vibe: 'party',
    language: Language.PUNJABI,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    coverUrl: 'https://picsum.photos/seed/music5/800/1200',
    isTrending: true,
    createdBy: 'admin'
  },
  {
    id: '6',
    title: 'Lo-Fi Chill',
    artist: 'Quiet Beats',
    genre: 'Lo-Fi',
    vibe: 'travel',
    language: Language.MIX,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    coverUrl: 'https://picsum.photos/seed/music6/800/1200',
    isTrending: false,
    createdBy: 'admin'
  }
];
