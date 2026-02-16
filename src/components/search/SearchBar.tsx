import type { FormEvent } from 'react'
import './SearchBar.css'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

function SearchBar({ value, onChange, onSubmit, disabled = false }: SearchBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <input
        aria-label="Buscar snippets"
        className="search-bar__input"
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar snippets..."
        type="search"
        value={value}
      />
      <button className="search-bar__button" disabled={disabled} type="submit">
        <span aria-hidden="true" className="search-bar__icon">
          ⌕
        </span>
        <span>Buscar</span>
      </button>
    </form>
  )
}

export default SearchBar
