export interface GameProcessor {
  process(ts: number, moveTick?: (ts: number) => void): void
  reset(): void
}
