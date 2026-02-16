import './ResultsEmptyState.css'

type ResultsEmptyStateProps = {
  message?: string
}

function ResultsEmptyState({ message = 'Sin resultados' }: ResultsEmptyStateProps) {
  return (
    <p className="results-empty-state">
      <span aria-hidden="true" className="results-empty-state__prompt">
        {'>>'}
      </span>{' '}
      {message}
    </p>
  )
}

export default ResultsEmptyState
