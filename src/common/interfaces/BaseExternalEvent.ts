// import { externalProcessor } from "../../core"

export class BaseExternalEvent {
  protected makeRequest<T>(func: (err: Error | null, ts: number) => void) {
    return
  }
}
