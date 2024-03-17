export interface GameProcessor {
  readonly Name: string
  process(ts: number, stepLimit?: number): number
  reset(): void
}
