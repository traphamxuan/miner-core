export interface GameProcessor {
  readonly Name: string
  process(ts: number, stepLimit?: number): number
  reset(): void
}

export class Loop {
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
        return tick;
      }
    }
    return ts;
  }
}
