export interface BaseComponent {
  load<T>(data: T): number
  unload(): void
  
  sync(ts: number): void
  update(req: any): void
  processInput(req: any): void
}
