let timer: NodeJS.Timeout | undefined

function nodeStart(processing: (ts: number) => void) {
  timer = setInterval(() => {
    processing(new Date().getTime())
  }, 13)
}

function nodeStop() {
  if (timer)
    clearInterval(timer)
  timer = undefined
}

let isStop = true

function webStart(processing: (ts: number) => void) {
  const callback = (ts: number) => {
    if (isStop) {
      return
    }
    processing(ts)
    window.requestAnimationFrame(callback)
  }
  window.requestAnimationFrame(callback)
  isStop = false
}

function webStop() {
  isStop = true
}