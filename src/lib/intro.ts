/**
 * Tiny coordination point between the first-load intro and page heroes.
 * Heroes wait for the intro curtain to lift before running their own
 * entrance, so the two sequences read as one choreographed moment.
 */
let done = false
const queue = new Set<() => void>()

export function whenIntroDone(cb: () => void) {
  if (done) {
    cb()
    return () => {}
  }
  queue.add(cb)
  return () => {
    queue.delete(cb)
  }
}

export function markIntroDone() {
  if (done) return
  // Flush on a fresh task so callbacks never run inside the intro's GSAP
  // context; anything cancelled in the meantime is skipped.
  setTimeout(() => {
    done = true
    queue.forEach((cb) => cb())
    queue.clear()
  }, 0)
}

export const isIntroDone = () => done
