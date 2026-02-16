import './SectionHeaderInline.css'

type SectionHeaderInlineProps = {
  count: number
  className?: string
}

function SectionHeaderInline({ count, className }: SectionHeaderInlineProps) {
  const classes = className ? `section-header-inline ${className}` : 'section-header-inline'

  return (
    <h3 className={classes}>
      <span aria-hidden="true" className="section-header-inline__prompt">
        {'>>'}
      </span>{' '}
      <span>Resultados: {count} snippets</span>
    </h3>
  )
}

export default SectionHeaderInline
