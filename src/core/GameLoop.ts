import { GameProcessor } from '../common/interfaces/GameProcessor'

export class GameLoop {
  private elapseTs: number
  private startTs: number
  private isContinue: boolean
  private static tick: number
  constructor(
    private external: GameProcessor,
    private internal: GameProcessor,
    private input: GameProcessor,
    private sync: GameProcessor,
  ) {
    this.elapseTs = 0
    this.startTs = -1
    this.isContinue = false
  }

  static get Tick() { return GameLoop.tick }
  private setTick(ts: number) { GameLoop.tick = ts }

  private getTicks(ts: number): number {
    return ts < this.startTs ? 0 : ts - this.startTs + this.elapseTs
  }

  reset() {
    this.internal.reset()
    this.input.reset()
    this.sync.reset()
  }

  start(elapseTs: number, startTs: number) {
    this.isContinue = true
    this.startTs = startTs
    this.elapseTs = elapseTs
  }

  stop() {
    this.isContinue = false
  }

  loop(ts: number) {
    if (!this.isContinue) return
    const tick = this.getTicks(ts)
    this.external.process(tick, this.setTick)
    this.internal.process(tick, this.setTick)
    this.sync.process(tick)
    this.input.process(tick)
  }
}
