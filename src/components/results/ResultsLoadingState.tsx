import './ResultsLoadingState.css'

type ResultsLoadingStateProps = {
  message?: string
  cards?: number
}

function ResultsLoadingState({ message = 'Cargando...', cards = 6 }: ResultsLoadingStateProps) {
  const placeholders = Array.from({ length: cards }, (_, index) => `loading-card-${index}`)

  return (
    <section aria-live="polite" className="results-loading-state" role="status">
      <p className="results-loading-state__message">
        <span aria-hidden="true" className="results-loading-state__prompt">
          {'>>'}
        </span>{' '}
        {message}
      </p>
      <div aria-hidden="true" className="results-loading-state__grid">
        {placeholders.map((id) => (
          <article className="results-loading-state__card" key={id}>
            <span className="results-loading-state__line results-loading-state__line--header" />
            <span className="results-loading-state__line results-loading-state__line--title" />
            <span className="results-loading-state__line results-loading-state__line--content" />
            <span className="results-loading-state__line results-loading-state__line--content-short" />
            <span className="results-loading-state__line results-loading-state__line--footer" />
          </article>
        ))}
      </div>
    </section>
  )
}

export default ResultsLoadingState
