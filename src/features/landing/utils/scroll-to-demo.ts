export function scrollToDemo() {
  const element = document.getElementById('demo')
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
