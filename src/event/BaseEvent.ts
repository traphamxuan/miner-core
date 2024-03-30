import { EventProcessor, EventUpdateFn, TEventRequest } from "./event"

export abstract class BaseEvent {
  private preMsgQueue: Record<string, TEventRequest>
  constructor(private EventProc: EventProcessor) {
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

  protected makeRequest<T>(
    id: string,
    ts: number,
    func: (
      ok: (value: T | PromiseLike<T>) => void,
      failed: (reason?: Error) => void,
      ) => EventUpdateFn,
    type: 'oneshot' | 'continuous' = 'oneshot',
  ) {
    // console.log('makeRequest', id, ts, isReplace, this.preMsgQueue)
    return new Promise<T>((ok, failed) => {
      const msg: TEventRequest = {
        id,
        isDone: false,
        ts,
        type,
        nonce: 0,
        update: func(ok, failed)
      }
      if (type == 'continuous') {
        const oldMsg = this.preMsgQueue[id]
        oldMsg && (oldMsg.isDone = true)
      }
      this.preMsgQueue[id] = msg
      this.EventProc.request(msg)
    })
  }

  protected removeRequest(id: string) {
    const msg = this.preMsgQueue[id]
    if (!msg) return
    msg.isDone = true
    msg.update && msg.update(0, true)
    delete this.preMsgQueue[id]
    // console.log(`removeRequest`, id, msg.ts, msg.isDone)
  }   
}