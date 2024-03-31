import type { GameProcessor } from "./loop"

export class InputProcessor implements GameProcessor {
  readonly Name = InputProcessor.name
  private execQueue: TInputRequest<any>[]
  private submitQueue: TInputRequest<any>[]
  private isSubmiting: boolean
  constructor() {
    this.execQueue = []
    this.submitQueue = []
    this.isSubmiting = false
  }

  process(timestamp: number, _?: number): number {
    for (let i = 0; i < this.execQueue.length; i++) {
      const act = this.execQueue[i]
      if (act.isDisable) continue
      act.action(null, timestamp, false)
      act.submit && this.submitQueue.push(act)
    }

    // submit
    this.execQueue = []
    return timestamp
  }

  request<T>(msg: TInputRequest<T>) {
    this.execQueue.push(msg)
  }

  reset(): void {
    this.execQueue.forEach(act => act.action(null, 0, true))
    this.execQueue = []
  }
}
