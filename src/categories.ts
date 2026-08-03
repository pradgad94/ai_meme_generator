export type CategoryId = 'bollywood' | 'cartoon' | 'viral-songs' | 'sports'

export interface Category {
  id: CategoryId
  emoji: string
  label: string
  blurb: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'bollywood',
    emoji: '🎬',
    label: 'Bollywood',
    blurb: 'Iconic actors, dramatic dialogues and filmy songs.',
  },
  {
    id: 'cartoon',
    emoji: '📺',
    label: 'Cartoons',
    blurb: 'Classic cartoons and childhood animated shows.',
  },
  {
    id: 'viral-songs',
    emoji: '🎵',
    label: 'Viral Songs',
    blurb: 'Songs and internet music trends stuck in your head.',
  },
  {
    id: 'sports',
    emoji: '⚽',
    label: 'Sports',
    blurb: 'Cricket, football and big tournament moments.',
  },
]
