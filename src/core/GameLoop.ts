import { GameProcessor } from '../common/interfaces/GameProcessor'

export class GameLoop {
  private processors: GameProcessor[]
  constructor(
    ...processors: GameProcessor[]
  ) {
    this.processors = processors
  }

  reset() {
    this.processors.forEach(processor => processor.reset())
  }

  run(ts: number, stepLimit?: number): number {
    for (const processor of this.processors) {
      let tick = processor.process(ts, stepLimit)
      if (tick < ts) {
        console.warn(`stop at`, processor.Name)
        return tick;
      }
    }
    return ts;
  }
}
