import './ResultsErrorState.css'

type ResultsErrorStateProps = {
  message: string
  onRetry: () => void
  disabled?: boolean
}

function ResultsErrorState({ message, onRetry, disabled = false }: ResultsErrorStateProps) {
  return (
    <article className="results-error-state" role="alert">
      <p className="results-error-state__message">{message}</p>
      <button className="results-error-state__retry" disabled={disabled} onClick={onRetry} type="button">
        Reintentar
      </button>
    </article>
  )
}

export default ResultsErrorState
