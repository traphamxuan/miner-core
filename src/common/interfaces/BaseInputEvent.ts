import { InputProcessor } from "../../core"

export class BaseInputEvent {
  constructor(private inputProcessor: InputProcessor) {}

  protected makeRequest<T>(func: (ok: (value: T | PromiseLike<T>) => void, failed: (reason?: Error) => void) => (err: Error | null, ts: number, isSkip: boolean) => void) {
    return new Promise<T>((ok, failed) => {
      this.inputProcessor.request({ action: func(ok, failed) })
    })
  }
}