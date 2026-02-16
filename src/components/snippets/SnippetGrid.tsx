import SnippetCard, { type SnippetCardItem } from './SnippetCard'
import './SnippetGrid.css'

type SnippetGridProps = {
  snippets: SnippetCardItem[]
  onToggleFavorite?: (snippet: SnippetCardItem) => void
  onDelete?: (snippet: SnippetCardItem) => void
  disabled?: boolean
}

function SnippetGrid({ snippets, onToggleFavorite, onDelete, disabled = false }: SnippetGridProps) {
  return (
    <section aria-label="Listado de snippets" className="snippet-grid">
      {snippets.map((snippet) => (
        <SnippetCard
          disabled={disabled}
          key={snippet.id}
          onDelete={onDelete ? () => onDelete(snippet) : undefined}
          onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(snippet) : undefined}
          snippet={snippet}
        />
      ))}
    </section>
  )
}

export type { SnippetCardItem }
export default SnippetGrid
