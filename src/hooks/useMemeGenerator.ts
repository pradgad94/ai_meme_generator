import { useState } from 'react'
import { generateMemes } from '../api/memes'
import type { CategoryId } from '../categories'
import type { Meme } from '../types'

export function useMemeGenerator() {
  const [memes, setMemes] = useState<Meme[]>([])
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generate(category: CategoryId) {
    setLoading(true)
    setError('')
    setActiveCategory(category)

    try {
      const results = await generateMemes(category)
      setMemes(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return { memes, activeCategory, loading, error, generate }
}
