export function uid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export function today() {
  return new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}
