import './SnippetCard.css'

export type SnippetCardItem = {
  id: number | string
  title: string
  content: string
  language: string
  tags: string[]
  createdAt: string
  isFavorite: boolean
}

type SnippetCardProps = {
  snippet: SnippetCardItem
  onToggleFavorite?: () => void
  onDelete?: () => void
  disabled?: boolean
}

function getLanguageTone(language: string): string {
  const normalized = language.trim().toLowerCase()

  if (
    normalized.includes('javascript') ||
    normalized === 'js' ||
    normalized.includes('typescript') ||
    normalized === 'ts'
  ) {
    return 'javascript'
  }

  if (normalized.includes('python') || normalized === 'py') return 'python'
  if (normalized.includes('docker')) return 'docker'
  if (normalized.includes('bash') || normalized === 'sh' || normalized.includes('shell')) return 'bash'
  if (normalized.includes('sql') || normalized.includes('postgres') || normalized.includes('mysql')) {
    return 'sql'
  }

  return 'default'
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function SnippetCard({ snippet, onToggleFavorite, onDelete, disabled = false }: SnippetCardProps) {
  const languageTone = getLanguageTone(snippet.language)

  return (
    <article className={`snippet-card snippet-card--${languageTone}`}>
      <header className="snippet-card__top">
        <span className="snippet-card__language">{snippet.language}</span>
        <div className="snippet-card__meta">
          <span>#{snippet.id}</span>
          <button
            aria-label={snippet.isFavorite ? 'Quitar favorito' : 'Marcar favorito'}
            className={snippet.isFavorite ? 'snippet-card__icon snippet-card__icon--favorite' : 'snippet-card__icon'}
            disabled={disabled}
            onClick={onToggleFavorite}
            type="button"
          >
            <span aria-hidden="true">{snippet.isFavorite ? '★' : '☆'}</span>
          </button>
        </div>
      </header>

      <h3 className="snippet-card__title">{snippet.title}</h3>
      <pre className="snippet-card__preview">{snippet.content}</pre>

      <footer className="snippet-card__footer">
        <div className="snippet-card__tags">
          {snippet.tags.length ? (
            snippet.tags.map((tag) => (
              <span key={`${snippet.id}-${tag}`} className="snippet-card__tag">
                {tag}
              </span>
            ))
          ) : (
            <span className="snippet-card__tag snippet-card__tag--empty">Sin tags</span>
          )}
        </div>
        <div className="snippet-card__actions">
          <span className="snippet-card__date">{formatDate(snippet.createdAt)}</span>
          <button
            aria-label="Eliminar snippet"
            className="snippet-card__icon snippet-card__icon--delete"
            disabled={disabled}
            onClick={onDelete}
            type="button"
          >
            <span aria-hidden="true">🗑</span>
          </button>
        </div>
      </footer>
    </article>
  )
}

export default SnippetCard
