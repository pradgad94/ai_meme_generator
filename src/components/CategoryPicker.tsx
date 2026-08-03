import { CATEGORIES } from '../categories'
import type { Category, CategoryId } from '../categories'

interface CategoryPickerProps {
  activeCategory: CategoryId | null
  disabled: boolean
  onSelect: (id: CategoryId) => void
}

function CategoryPicker({ activeCategory, disabled, onSelect }: CategoryPickerProps) {
  return (
    <div className="category-grid" role="group" aria-label="Meme categories">
      {CATEGORIES.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          active={category.id === activeCategory}
          disabled={disabled}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

interface CategoryCardProps {
  category: Category
  active: boolean
  disabled: boolean
  onSelect: (id: CategoryId) => void
}

function CategoryCard({ category, active, disabled, onSelect }: CategoryCardProps) {
  const className = active ? 'category-card category-card--active' : 'category-card'

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      aria-pressed={active}
      onClick={() => onSelect(category.id)}
    >
      <span className="category-card__emoji" aria-hidden="true">
        {category.emoji}
      </span>
      <span className="category-card__label">{category.label}</span>
      <span className="category-card__blurb">{category.blurb}</span>
    </button>
  )
}

export default CategoryPicker
