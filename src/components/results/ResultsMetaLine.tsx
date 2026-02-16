import './ResultsMetaLine.css'

type ResultsMetaLineProps = {
  count: number
  className?: string
}

function ResultsMetaLine({ count, className }: ResultsMetaLineProps) {
  const classes = className ? `results-meta-line ${className}` : 'results-meta-line'

  return <p className={classes}>Resultados: {count} snippets</p>
}

export default ResultsMetaLine
