import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

type Language = {
  id: number
  name: string
  description: string | null
  created_at: string
}

type Tag = {
  id: number
  name: string
  created_at: string
}

type Snippet = {
  id: number
  title: string
  content: string
  language_id: number
  is_favorite: boolean
  created_at: string
}

type JsonRecord = Record<string, unknown>

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const hasBody = options?.body !== undefined

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: hasBody
      ? {
          'Content-Type': 'application/json',
          ...(options?.headers ?? {}),
        }
      : options?.headers,
    ...options,
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as JsonRecord
    const detail = typeof body.detail === 'string' ? body.detail : response.statusText
    throw new Error(detail || 'Request failed')
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

function App() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [working, setWorking] = useState(false)

  const [languageName, setLanguageName] = useState('')
  const [languageDescription, setLanguageDescription] = useState('')
  const [tagName, setTagName] = useState('')
  const [snippetTitle, setSnippetTitle] = useState('')
  const [snippetContent, setSnippetContent] = useState('')
  const [snippetLanguageId, setSnippetLanguageId] = useState<number | ''>('')
  const [snippetFavorite, setSnippetFavorite] = useState(false)

  const languageMap = useMemo(() => {
    return new Map(languages.map((language) => [language.id, language.name]))
  }, [languages])

  async function loadData() {
    setLoading(true)
    setError(null)

    try {
      const [languagesData, tagsData, snippetsData] = await Promise.all([
        apiRequest<Language[]>('/languages/'),
        apiRequest<Tag[]>('/tags/'),
        apiRequest<Snippet[]>('/snippets/'),
      ])

      setLanguages(languagesData)
      setTags(tagsData)
      setSnippets(snippetsData)
    } catch (requestError) {
      setError((requestError as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  async function runAction(action: () => Promise<void>) {
    setWorking(true)
    setError(null)

    try {
      await action()
      await loadData()
    } catch (requestError) {
      setError((requestError as Error).message)
    } finally {
      setWorking(false)
    }
  }

  async function handleLanguageSubmit(event: FormEvent) {
    event.preventDefault()
    if (!languageName.trim()) return

    await runAction(async () => {
      await apiRequest('/languages/', {
        method: 'POST',
        body: JSON.stringify({
          name: languageName.trim(),
          description: languageDescription.trim() || null,
        }),
      })

      setLanguageName('')
      setLanguageDescription('')
    })
  }

  async function handleTagSubmit(event: FormEvent) {
    event.preventDefault()
    if (!tagName.trim()) return

    await runAction(async () => {
      await apiRequest('/tags/', {
        method: 'POST',
        body: JSON.stringify({ name: tagName.trim() }),
      })

      setTagName('')
    })
  }

  async function handleSnippetSubmit(event: FormEvent) {
    event.preventDefault()
    if (!snippetTitle.trim() || !snippetContent.trim() || !snippetLanguageId) return

    await runAction(async () => {
      await apiRequest('/snippets/', {
        method: 'POST',
        body: JSON.stringify({
          title: snippetTitle.trim(),
          content: snippetContent.trim(),
          language_id: snippetLanguageId,
          is_favorite: snippetFavorite,
        }),
      })

      setSnippetTitle('')
      setSnippetContent('')
      setSnippetLanguageId('')
      setSnippetFavorite(false)
    })
  }

  async function toggleSnippetFavorite(snippet: Snippet) {
    await runAction(async () => {
      await apiRequest(`/snippets/${snippet.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_favorite: !snippet.is_favorite }),
      })
    })
  }

  async function deleteLanguage(id: number) {
    await runAction(async () => {
      await apiRequest(`/languages/${id}`, { method: 'DELETE' })
    })
  }

  async function deleteTag(id: number) {
    await runAction(async () => {
      await apiRequest(`/tags/${id}`, { method: 'DELETE' })
    })
  }

  async function deleteSnippet(id: number) {
    await runAction(async () => {
      await apiRequest(`/snippets/${id}`, { method: 'DELETE' })
    })
  }

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>Snippet Vault Frontend</h1>
          <p>Cliente simple para consumir la API de snippets, tags y lenguajes.</p>
          <p className="hint">
            API: <code>{API_BASE_URL}</code>
          </p>
        </div>
        <button disabled={loading || working} onClick={() => void loadData()} type="button">
          Recargar
        </button>
      </header>

      {error ? <p className="error">Error: {error}</p> : null}
      {loading ? <p className="status">Cargando datos...</p> : null}

      <section className="grid">
        <article className="panel">
          <h2>Lenguajes</h2>
          <form onSubmit={(event) => void handleLanguageSubmit(event)}>
            <input
              onChange={(event) => setLanguageName(event.target.value)}
              placeholder="Nombre"
              required
              value={languageName}
            />
            <input
              onChange={(event) => setLanguageDescription(event.target.value)}
              placeholder="Descripción opcional"
              value={languageDescription}
            />
            <button disabled={working} type="submit">
              Crear lenguaje
            </button>
          </form>
          <ul>
            {languages.map((language) => (
              <li key={language.id}>
                <div>
                  <strong>{language.name}</strong>
                  {language.description ? <p>{language.description}</p> : null}
                </div>
                <button disabled={working} onClick={() => void deleteLanguage(language.id)} type="button">
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2>Tags</h2>
          <form onSubmit={(event) => void handleTagSubmit(event)}>
            <input
              onChange={(event) => setTagName(event.target.value)}
              placeholder="Nombre del tag"
              required
              value={tagName}
            />
            <button disabled={working} type="submit">
              Crear tag
            </button>
          </form>
          <ul>
            {tags.map((tag) => (
              <li key={tag.id}>
                <strong>{tag.name}</strong>
                <button disabled={working} onClick={() => void deleteTag(tag.id)} type="button">
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <article className="panel panel-full">
        <h2>Snippets</h2>
        <form className="snippet-form" onSubmit={(event) => void handleSnippetSubmit(event)}>
          <input
            onChange={(event) => setSnippetTitle(event.target.value)}
            placeholder="Título"
            required
            value={snippetTitle}
          />
          <select
            onChange={(event) => {
              const value = event.target.value
              setSnippetLanguageId(value ? Number(value) : '')
            }}
            required
            value={snippetLanguageId}
          >
            <option value="">Selecciona lenguaje</option>
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
          </select>
          <textarea
            onChange={(event) => setSnippetContent(event.target.value)}
            placeholder="Contenido del snippet"
            required
            rows={6}
            value={snippetContent}
          />
          <label className="favorite-toggle">
            <input
              checked={snippetFavorite}
              onChange={(event) => setSnippetFavorite(event.target.checked)}
              type="checkbox"
            />
            Marcar como favorito
          </label>
          <button disabled={working || !languages.length} type="submit">
            Crear snippet
          </button>
        </form>

        <ul>
          {snippets.map((snippet) => (
            <li key={snippet.id} className="snippet-item">
              <div>
                <h3>
                  {snippet.title}{' '}
                  {snippet.is_favorite ? <span className="pill favorite">Favorito</span> : null}
                </h3>
                <p className="meta">
                  Lenguaje: {languageMap.get(snippet.language_id) ?? `ID ${snippet.language_id}`}
                </p>
                <pre>{snippet.content}</pre>
              </div>
              <div className="actions">
                <button disabled={working} onClick={() => void toggleSnippetFavorite(snippet)} type="button">
                  {snippet.is_favorite ? 'Quitar favorito' : 'Marcar favorito'}
                </button>
                <button
                  className="danger"
                  disabled={working}
                  onClick={() => void deleteSnippet(snippet.id)}
                  type="button"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </main>
  )
}

export default App
