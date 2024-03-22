import { Heap } from 'heap-js';
import { GameProcessor } from '../common/interfaces/GameProcessor';

export type InternalUpdateFn = (ts: number, isSkip: boolean) => number

export type TInternalRequest = {
  id: string
  // key: string
  // data: object
  ts: number
  nonce: number
  isDone: boolean
  type: 'oneshot' | 'continuous'
  update: InternalUpdateFn
}

export class InternalProcessor implements GameProcessor {
  readonly Name = InternalProcessor.name
  private queue: Heap<TInternalRequest>
  private nonce: number
  constructor() {
    this.queue = new Heap((a, b) => a.ts == b.ts ? a.nonce- b.nonce: a.ts - b.ts)
    this.queue.init([])
    this.nonce = 0
  }
  process(ts: number, limitStep?: number): number {
    let req = this.queue.peek()
    let tick = ts
    for (; req; req=this.queue.peek()) {
      if (req.ts > ts) {
        return ts
      }
      tick = req.ts
      this.queue.pop()
      const nextTs = req.update(req.ts, req.isDone)
      let tmp: never
      switch (req.type) {
        case 'oneshot':
          req.isDone = true
          break
        case 'continuous':
          if (nextTs > req.ts) {
            req.ts = nextTs
            this.queue.push(req)
          }
          break
        default:
          tmp = req.type
          break
      }
      if (limitStep) {
        limitStep--
      }
      if (limitStep === 0) {
        break
      }
    }
    if (this.queue.length == 0) {
      return ts
    }
    return tick
  }

  reset(): void {
    for(let req = this.queue.pop(); req; req = this.queue.pop()) {
      req.update(0, true)
      req.isDone = true
    }
    this.queue.clear()
  }

  request(msg: TInternalRequest) {
    msg.nonce = this.nonce++
    this.queue.push(msg)
    // console.log(`inside internal queue`, this.queue.toArray())
  }
}
