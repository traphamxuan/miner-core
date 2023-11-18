import { GameProcessor } from "../common/interfaces/GameProcessor"

export type TInputRequest<T> = {
  // id: string
  // key: string
  // data: T
  isDisable?: boolean
  action: (err: Error | null, ts: number, isSkip: boolean) => T
  submit?: (id: string, data: T) => void
  // callback?: <T>(result: T) => void
}

export class InputProcessor implements GameProcessor {
  private execQueue: TInputRequest<any>[]
  private submitQueue: TInputRequest<any>[]
  private isSubmiting: boolean

  constructor() {
    this.execQueue = []
    this.submitQueue = []
    this.isSubmiting = false
  }

  process(timestamp: number) {
    this.execQueue.forEach(act => {
      if (act.isDisable) return
      act.action(null, timestamp, false)
      act.submit && this.submitQueue.push(act)
    })

    // submit
    this.execQueue = []
  }

  request<T>(msg: TInputRequest<T>) {
    this.execQueue.push(msg)
  }

  reset(): void {
    this.execQueue.forEach(act => act.action(null, 0, true))
    this.execQueue = []
  }
}
