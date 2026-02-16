import './Pagination.css'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
  onClear?: () => void
}

type PaginationToken = number | 'ellipsis'

function buildPaginationTokens(currentPage: number, totalPages: number): PaginationToken[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1])
  const normalizedPages = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((first, second) => first - second)

  const tokens: PaginationToken[] = []

  for (let index = 0; index < normalizedPages.length; index += 1) {
    const page = normalizedPages[index]
    const previousPage = normalizedPages[index - 1]

    if (index > 0 && previousPage !== undefined && page - previousPage > 1) {
      tokens.push('ellipsis')
    }

    tokens.push(page)
  }

  return tokens
}

function Pagination({ currentPage, totalPages, onPageChange, disabled = false, onClear }: PaginationProps) {
  if (totalPages <= 1 && !onClear) {
    return null
  }

  const tokens = buildPaginationTokens(currentPage, totalPages)

  return (
    <nav aria-label="Paginacion de resultados" className="pagination">
      <div aria-hidden="true" className="pagination__spacer" />

      <ul className="pagination__list">
        {tokens.map((token, index) => {
          if (token === 'ellipsis') {
            return (
              <li className="pagination__item" key={`ellipsis-${index}`}>
                <span aria-hidden="true" className="pagination__ellipsis">
                  ...
                </span>
              </li>
            )
          }

          const isActive = token === currentPage

          return (
            <li className="pagination__item" key={token}>
              <button
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Ir a la pagina ${token}`}
                className={isActive ? 'pagination__button pagination__button--active' : 'pagination__button'}
                disabled={disabled || isActive}
                onClick={() => onPageChange(token)}
                type="button"
              >
                {token}
              </button>
            </li>
          )
        })}
      </ul>

      {onClear ? (
        <button aria-label="Limpiar busqueda" className="pagination__clear" disabled={disabled} onClick={onClear} type="button">
          <span aria-hidden="true">×</span>
        </button>
      ) : (
        <div aria-hidden="true" className="pagination__spacer" />
      )}
    </nav>
  )
}

export default Pagination
