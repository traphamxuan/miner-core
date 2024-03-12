import { GameProcessor } from '../common/interfaces/GameProcessor'

export class GameLoop {
  private tick: number
  constructor(
    private external: GameProcessor,
    private internal: GameProcessor,
    private input: GameProcessor,
    private sync: GameProcessor,
  ) {
    this.tick = 0
  }

  get Tick() { return this.tick }

  reset() {
    this.internal.reset()
    this.input.reset()
    this.sync.reset()
  }

  run(ts: number, limit = 20): number {
    this.tick = ts
    let stopAt = Date.now() + limit
    let step = 0
    const moveTick = (ts: number) => {
      if (step < 1000) {
        step++
      } else {
        if (Date.now() > stopAt) {
          return false
        } else {
          step = 0
        }
      }
      this.tick = ts
      return true
    }
    this.external.process(ts, moveTick)
    this.internal.process(ts, moveTick)
    ts = this.tick
    this.sync.process(ts)
    this.input.process(ts)
    return ts
  }
}
