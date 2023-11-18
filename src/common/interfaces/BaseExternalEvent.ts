// import { externalProcessor } from "../../core"

export class BaseExternalEvent {
  protected makeRequest<T>(func: (ok: (value: T | PromiseLike<T>) => void, failed: (reason?: Error) => void) => (err: Error | null, ts: number) => void) {
    return new Promise<T>((ok, failed) => {
      // externalProcessor.request({ update: func(ok, failed) })
    })
  }
}
