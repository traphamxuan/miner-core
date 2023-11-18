import { inputProcessor } from "../../core"

export class BaseInputEvent {
  // constructor() {
  // }

  protected makeRequest<T>(func: (ok: (value: T | PromiseLike<T>) => void, failed: (reason?: Error) => void) => (err: Error | null, ts: number, isSkip: boolean) => void) {
    return new Promise<T>((ok, failed) => {
      inputProcessor.request({ action: func(ok, failed) })
    })
  }
}