import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HeroTitle from './components/hero/HeroTitle'
import SearchBar from './components/search/SearchBar'
import ResultsMetaLine from './components/results/ResultsMetaLine'
import SectionHeaderInline from './components/results/SectionHeaderInline'
import ResultsLoadingState from './components/results/ResultsLoadingState'
import ResultsEmptyState from './components/results/ResultsEmptyState'
import ResultsErrorState from './components/results/ResultsErrorState'
import SnippetGrid, { type SnippetCardItem } from './components/snippets/SnippetGrid'
import Pagination from './components/pagination/Pagination'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'
const SNIPPETS_PER_PAGE = 6

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
  tag_ids: number[]
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
  const [searchDraft, setSearchDraft] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [languageName, setLanguageName] = useState('')
  const [languageDescription, setLanguageDescription] = useState('')
  const [tagName, setTagName] = useState('')
  const [snippetTitle, setSnippetTitle] = useState('')
  const [snippetContent, setSnippetContent] = useState('')
  const [snippetLanguageId, setSnippetLanguageId] = useState<number | ''>('')
  const [snippetFavorite, setSnippetFavorite] = useState(false)
  const [snippetTagIds, setSnippetTagIds] = useState<number[]>([])
  const [editingLanguageId, setEditingLanguageId] = useState<number | null>(null)
  const [editingLanguageName, setEditingLanguageName] = useState('')
  const [editingLanguageDescription, setEditingLanguageDescription] = useState('')
  const [editingTagId, setEditingTagId] = useState<number | null>(null)
  const [editingTagName, setEditingTagName] = useState('')
  const [editingSnippetId, setEditingSnippetId] = useState<number | null>(null)
  const [editingSnippetTitle, setEditingSnippetTitle] = useState('')
  const [editingSnippetContent, setEditingSnippetContent] = useState('')
  const [editingSnippetLanguageId, setEditingSnippetLanguageId] = useState<number | ''>('')
  const [editingSnippetFavorite, setEditingSnippetFavorite] = useState(false)
  const [editingSnippetTagIds, setEditingSnippetTagIds] = useState<number[]>([])

  const languageMap = useMemo(() => {
    return new Map(languages.map((language) => [language.id, language.name]))
  }, [languages])

  const tagMap = useMemo(() => {
    return new Map(tags.map((tag) => [tag.id, tag.name]))
  }, [tags])

  const filteredSnippets = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) return snippets

    return snippets.filter((snippet) => {
      const languageName = languageMap.get(snippet.language_id) ?? ''
      const tagNames = snippet.tag_ids.map((tagId) => tagMap.get(tagId) ?? '')
      const haystack = [snippet.title, snippet.content, languageName, ...tagNames]
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedSearch)
    })
  }, [languageMap, searchTerm, snippets, tagMap])

  const favoriteSnippets = useMemo(() => {
    return snippets.filter((snippet) => snippet.is_favorite)
  }, [snippets])

  const toSnippetCardItem = useMemo(() => {
    return (snippet: Snippet): SnippetCardItem => ({
      id: snippet.id,
      title: snippet.title,
      content: snippet.content,
      language: languageMap.get(snippet.language_id) ?? `ID ${snippet.language_id}`,
      tags: snippet.tag_ids.map((tagId) => tagMap.get(tagId) ?? `Tag ${tagId}`),
      createdAt: snippet.created_at,
      isFavorite: snippet.is_favorite,
    })
  }, [languageMap, tagMap])

  const filteredSnippetCards = useMemo(() => {
    return filteredSnippets.map(toSnippetCardItem)
  }, [filteredSnippets, toSnippetCardItem])

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredSnippetCards.length / SNIPPETS_PER_PAGE))
  }, [filteredSnippetCards.length])

  const paginatedSnippetCards = useMemo(() => {
    const startIndex = (currentPage - 1) * SNIPPETS_PER_PAGE
    return filteredSnippetCards.slice(startIndex, startIndex + SNIPPETS_PER_PAGE)
  }, [currentPage, filteredSnippetCards])

  const favoriteSnippetCards = useMemo(() => {
    return favoriteSnippets.map(toSnippetCardItem)
  }, [favoriteSnippets, toSnippetCardItem])

  function toggleTag(tagIds: number[], tagId: number): number[] {
    if (tagIds.includes(tagId)) {
      return tagIds.filter((id) => id !== tagId)
    }

    return [...tagIds, tagId]
  }

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

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages))
  }, [totalPages])

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
          tag_ids: snippetTagIds,
        }),
      })

      setSnippetTitle('')
      setSnippetContent('')
      setSnippetLanguageId('')
      setSnippetFavorite(false)
      setSnippetTagIds([])
    })
  }

  async function toggleSnippetFavorite(snippet: Pick<Snippet, 'id' | 'is_favorite'>) {
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

  function startLanguageEdit(language: Language) {
    setEditingLanguageId(language.id)
    setEditingLanguageName(language.name)
    setEditingLanguageDescription(language.description ?? '')
  }

  function cancelLanguageEdit() {
    setEditingLanguageId(null)
    setEditingLanguageName('')
    setEditingLanguageDescription('')
  }

  async function handleLanguagePatch(event: FormEvent) {
    event.preventDefault()
    if (!editingLanguageId || !editingLanguageName.trim()) return

    await runAction(async () => {
      await apiRequest(`/languages/${editingLanguageId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: editingLanguageName.trim(),
          description: editingLanguageDescription.trim() || null,
        }),
      })
      cancelLanguageEdit()
    })
  }

  function startTagEdit(tag: Tag) {
    setEditingTagId(tag.id)
    setEditingTagName(tag.name)
  }

  function cancelTagEdit() {
    setEditingTagId(null)
    setEditingTagName('')
  }

  async function handleTagPatch(event: FormEvent) {
    event.preventDefault()
    if (!editingTagId || !editingTagName.trim()) return

    await runAction(async () => {
      await apiRequest(`/tags/${editingTagId}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: editingTagName.trim() }),
      })
      cancelTagEdit()
    })
  }

  function startSnippetEdit(snippet: Snippet) {
    setEditingSnippetId(snippet.id)
    setEditingSnippetTitle(snippet.title)
    setEditingSnippetContent(snippet.content)
    setEditingSnippetLanguageId(snippet.language_id)
    setEditingSnippetFavorite(snippet.is_favorite)
    setEditingSnippetTagIds(snippet.tag_ids)
  }

  function cancelSnippetEdit() {
    setEditingSnippetId(null)
    setEditingSnippetTitle('')
    setEditingSnippetContent('')
    setEditingSnippetLanguageId('')
    setEditingSnippetFavorite(false)
    setEditingSnippetTagIds([])
  }

  async function handleSnippetPatch(event: FormEvent) {
    event.preventDefault()
    if (
      !editingSnippetId ||
      !editingSnippetTitle.trim() ||
      !editingSnippetContent.trim() ||
      !editingSnippetLanguageId
    ) {
      return
    }

    await runAction(async () => {
      await apiRequest(`/snippets/${editingSnippetId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: editingSnippetTitle.trim(),
          content: editingSnippetContent.trim(),
          language_id: editingSnippetLanguageId,
          is_favorite: editingSnippetFavorite,
          tag_ids: editingSnippetTagIds,
        }),
      })
      cancelSnippetEdit()
    })
  }

  function handleSearchSubmit() {
    setSearchTerm(searchDraft)
    setCurrentPage(1)
  }

  function clearSearchAndPagination() {
    setSearchDraft('')
    setSearchTerm('')
    setCurrentPage(1)
  }

  function renderFeedback() {
    return (
      <>
        {error ? <p className="error">Error: {error}</p> : null}
        {loading ? <p className="status">Cargando datos...</p> : null}
      </>
    )
  }

  function renderSnippetResults() {
    if (loading) {
      return <ResultsLoadingState />
    }

    if (error && !filteredSnippetCards.length) {
      return <ResultsErrorState disabled={working} message={`Error: ${error}`} onRetry={() => void loadData()} />
    }

    if (!filteredSnippetCards.length) {
      return <ResultsEmptyState />
    }

    return (
      <>
        {error ? (
          <ResultsErrorState disabled={working} message={`Error: ${error}`} onRetry={() => void loadData()} />
        ) : null}
        <SnippetGrid
          disabled={working}
          onDelete={(snippet) => void deleteSnippet(Number(snippet.id))}
          onToggleFavorite={(snippet) =>
            void toggleSnippetFavorite({
              id: Number(snippet.id),
              is_favorite: snippet.isFavorite,
            })
          }
          snippets={paginatedSnippetCards}
        />
      </>
    )
  }

  return (
    <Layout>
      <main className="app">
        <Routes>
          <Route
            element={
              <section className="page-stack">
                <section className="app-hero-search">
                  <HeroTitle />
                  <SearchBar
                    disabled={loading}
                    onChange={setSearchDraft}
                    onSubmit={handleSearchSubmit}
                    value={searchDraft}
                  />
                  <ResultsMetaLine count={filteredSnippets.length} />
                </section>
                <section className="app-results-header" aria-label="Resumen de resultados">
                  <SectionHeaderInline count={filteredSnippets.length} />
                </section>

                <section className="app-snippet-grid-block" aria-label="Resultados de snippets">
                  {renderSnippetResults()}
                </section>

                {!loading && filteredSnippetCards.length ? (
                  <section className="app-pagination-block" aria-label="Navegación de páginas">
                    <Pagination
                      currentPage={currentPage}
                      disabled={working}
                      onClear={searchTerm.trim() ? clearSearchAndPagination : undefined}
                      onPageChange={setCurrentPage}
                      totalPages={totalPages}
                    />
                  </section>
                ) : null}
              </section>
            }
            path="/"
          />

          <Route
            element={
              <section className="page-stack">
                <h2 className="page-title">Crear y gestionar snippets</h2>
                {renderFeedback()}

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
                    <div className="tags-picker">
                      <p>Tags</p>
                      <div className="tags-picker-options">
                        {tags.length ? (
                          tags.map((tag) => (
                            <label key={tag.id} className="tag-option">
                              <input
                                checked={snippetTagIds.includes(tag.id)}
                                onChange={() => setSnippetTagIds((prev) => toggleTag(prev, tag.id))}
                                type="checkbox"
                              />
                              {tag.name}
                            </label>
                          ))
                        ) : (
                          <span className="meta">No hay tags disponibles.</span>
                        )}
                      </div>
                    </div>
                    <button disabled={working || !languages.length} type="submit">
                      Crear snippet
                    </button>
                  </form>

                  <ul>
                    {snippets.map((snippet) => (
                      <li key={snippet.id} className="snippet-item">
                        {editingSnippetId === snippet.id ? (
                          <form className="edit-form" onSubmit={(event) => void handleSnippetPatch(event)}>
                            <input
                              onChange={(event) => setEditingSnippetTitle(event.target.value)}
                              required
                              value={editingSnippetTitle}
                            />
                            <select
                              onChange={(event) => {
                                const value = event.target.value
                                setEditingSnippetLanguageId(value ? Number(value) : '')
                              }}
                              required
                              value={editingSnippetLanguageId}
                            >
                              <option value="">Selecciona lenguaje</option>
                              {languages.map((language) => (
                                <option key={language.id} value={language.id}>
                                  {language.name}
                                </option>
                              ))}
                            </select>
                            <textarea
                              onChange={(event) => setEditingSnippetContent(event.target.value)}
                              required
                              rows={5}
                              value={editingSnippetContent}
                            />
                            <label className="favorite-toggle">
                              <input
                                checked={editingSnippetFavorite}
                                onChange={(event) => setEditingSnippetFavorite(event.target.checked)}
                                type="checkbox"
                              />
                              Favorito
                            </label>
                            <div className="tags-picker">
                              <p>Tags</p>
                              <div className="tags-picker-options">
                                {tags.length ? (
                                  tags.map((tag) => (
                                    <label key={tag.id} className="tag-option">
                                      <input
                                        checked={editingSnippetTagIds.includes(tag.id)}
                                        onChange={() =>
                                          setEditingSnippetTagIds((prev) => toggleTag(prev, tag.id))
                                        }
                                        type="checkbox"
                                      />
                                      {tag.name}
                                    </label>
                                  ))
                                ) : (
                                  <span className="meta">No hay tags disponibles.</span>
                                )}
                              </div>
                            </div>
                            <div className="actions">
                              <button disabled={working} type="submit">
                                Guardar
                              </button>
                              <button disabled={working} onClick={cancelSnippetEdit} type="button">
                                Cancelar
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div>
                              <h3>
                                {snippet.title}{' '}
                                {snippet.is_favorite ? <span className="pill favorite">Favorito</span> : null}
                              </h3>
                              <p className="meta">
                                Lenguaje: {languageMap.get(snippet.language_id) ?? `ID ${snippet.language_id}`}
                              </p>
                              {snippet.tag_ids.length ? (
                                <div className="tag-list">
                                  {snippet.tag_ids.map((tagId) => (
                                    <span key={`${snippet.id}-${tagId}`} className="pill tag-pill">
                                      {tagMap.get(tagId) ?? `Tag ${tagId}`}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="meta">Sin tags</p>
                              )}
                              <pre>{snippet.content}</pre>
                            </div>
                            <div className="actions">
                              <button disabled={working} onClick={() => startSnippetEdit(snippet)} type="button">
                                Editar
                              </button>
                              <button
                                disabled={working}
                                onClick={() => void toggleSnippetFavorite(snippet)}
                                type="button"
                              >
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
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </article>
              </section>
            }
            path="/snippets"
          />

          <Route
            element={
              <section className="page-stack">
                <h2 className="page-title">Lenguajes</h2>
                {renderFeedback()}

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
                        {editingLanguageId === language.id ? (
                          <form className="edit-form" onSubmit={(event) => void handleLanguagePatch(event)}>
                            <input
                              onChange={(event) => setEditingLanguageName(event.target.value)}
                              required
                              value={editingLanguageName}
                            />
                            <input
                              onChange={(event) => setEditingLanguageDescription(event.target.value)}
                              placeholder="Descripción opcional"
                              value={editingLanguageDescription}
                            />
                            <div className="actions">
                              <button disabled={working} type="submit">
                                Guardar
                              </button>
                              <button disabled={working} onClick={cancelLanguageEdit} type="button">
                                Cancelar
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div>
                              <strong>{language.name}</strong>
                              {language.description ? <p>{language.description}</p> : null}
                            </div>
                            <div className="actions">
                              <button disabled={working} onClick={() => startLanguageEdit(language)} type="button">
                                Editar
                              </button>
                              <button
                                disabled={working}
                                onClick={() => void deleteLanguage(language.id)}
                                type="button"
                              >
                                Eliminar
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </article>
              </section>
            }
            path="/languages"
          />

          <Route
            element={
              <section className="page-stack">
                <h2 className="page-title">Tags</h2>
                {renderFeedback()}

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
                        {editingTagId === tag.id ? (
                          <form className="edit-form" onSubmit={(event) => void handleTagPatch(event)}>
                            <input
                              onChange={(event) => setEditingTagName(event.target.value)}
                              required
                              value={editingTagName}
                            />
                            <div className="actions">
                              <button disabled={working} type="submit">
                                Guardar
                              </button>
                              <button disabled={working} onClick={cancelTagEdit} type="button">
                                Cancelar
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <strong>{tag.name}</strong>
                            <div className="actions">
                              <button disabled={working} onClick={() => startTagEdit(tag)} type="button">
                                Editar
                              </button>
                              <button disabled={working} onClick={() => void deleteTag(tag.id)} type="button">
                                Eliminar
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </article>
              </section>
            }
            path="/tags"
          />

          <Route
            element={
              <section className="page-stack">
                <h2 className="page-title">Favoritos</h2>
                {renderFeedback()}

                <article className="panel panel-full">
                  <h2>Snippets favoritos</h2>
                  {!favoriteSnippetCards.length && !loading ? (
                    <p className="meta">No tienes snippets favoritos todavía.</p>
                  ) : (
                    <SnippetGrid
                      disabled={working}
                      onDelete={(snippet) => void deleteSnippet(Number(snippet.id))}
                      onToggleFavorite={(snippet) =>
                        void toggleSnippetFavorite({
                          id: Number(snippet.id),
                          is_favorite: snippet.isFavorite,
                        })
                      }
                      snippets={favoriteSnippetCards}
                    />
                  )}
                </article>
              </section>
            }
            path="/favorites"
          />

          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </main>
    </Layout>
  )
}

export default App
