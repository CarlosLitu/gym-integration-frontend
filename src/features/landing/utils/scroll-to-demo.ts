export function scrollToSection(id: string) {
  const element = document.getElementById(id)
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function scrollToDemo() {
  scrollToSection('demo')
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
