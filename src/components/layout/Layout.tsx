import type { ReactNode } from 'react'
import Navbar from '../navigation/Navbar'
import './Layout.css'

type LayoutProps = {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <div className="layout__content">
        <Navbar />
        <main className="layout__main">{children}</main>
      </div>
    </div>
  )
}

export default Layout
