import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import '@/i18n'
import '@/assets/css/global.css'
import faviconUrl from '@/assets/images/pulse-icon.png'

const faviconLink =
  document.querySelector<HTMLLinkElement>("link[rel='icon']") ??
  (() => {
    const link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
    return link
  })()

faviconLink.type = 'image/png'
faviconLink.href = faviconUrl

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
