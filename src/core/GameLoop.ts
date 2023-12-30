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
  private setTick(ts: number) { this.tick = ts }

  reset() {
    this.internal.reset()
    this.input.reset()
    this.sync.reset()
  }

  run(ts: number) {
    this.tick = ts
    const setTick = (ts: number) => this.setTick(ts)
    this.external.process(ts, setTick)
    this.internal.process(ts, setTick)
    this.sync.process(ts)
    this.input.process(ts)
  }
}
