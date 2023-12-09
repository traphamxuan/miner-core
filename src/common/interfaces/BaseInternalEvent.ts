import { InternalProcessor, TInternalRequest } from "../../core"

export abstract class BaseInternalEvent {
  private preMsgQueue: Record<string, TInternalRequest>
  constructor(private internalProc: InternalProcessor) {
    this.preMsgQueue = {}
  }

  flush(): void {
    Object.values(this.preMsgQueue).forEach(message => message.isDone = true)
    this.preMsgQueue = {}
  }

  protected updateRequest(oldId: string, newId: string) {
    const msg = this.preMsgQueue[oldId]
    if (!msg) return
    msg.id = newId
    this.preMsgQueue[newId] = msg
    delete this.preMsgQueue[oldId]
  }

  protected makeRequest<T>(id: string, ts: number, func: (
    ok: (value: T | PromiseLike<T>) => void,
    failed: (reason?: Error) => void,
    ) => (err: Error | null, ts: number, isSkip: boolean) => void, isReplace = true) {
    return new Promise<T>((ok, failed) => {
      const msg: TInternalRequest = {
        id,
        isDone: false,
        ts,
        update: func(ok, failed)
      }
      if (isReplace) {
        const oldMsg = this.preMsgQueue[id]
        oldMsg && (oldMsg.isDone = true)
      }
      this.preMsgQueue[id] = msg
      this.internalProc.request(msg)
    })
  }

  protected removeRequest(id: string) {
    const msg = this.preMsgQueue[id]
    if (!msg) return
    msg.isDone = true
    msg.update && msg.update(null, 0, true)
    delete this.preMsgQueue[id]
  }

  makeEvent(
    id: string,
    ts: number,
    executor: (err: Error | null, ts: number, isSkip: boolean) => void,
    isReplace = true,
  ) {
    const msg: TInternalRequest = {
      id,
      isDone: false,
      ts,
      update: executor
    }
    if (isReplace) {
      const oldMsg = this.preMsgQueue[id]
      oldMsg && (oldMsg.isDone = true)
    }
    this.preMsgQueue[id] = msg
    this.internalProc.request(msg)
  }
    
}