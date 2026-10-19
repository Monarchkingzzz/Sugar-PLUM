// Custom Event emitter so any component (minigame, memory, sticky note) can trigger Menace Guide commentary
export const triggerMenaceComment = (topic) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('menace-guide-event', { detail: { topic } }))
  }
}
