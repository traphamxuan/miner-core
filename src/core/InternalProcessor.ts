import { Heap } from 'heap-js';
import { GameProcessor } from '../common/interfaces/GameProcessor';

export type TInternalRequest = {
  id: string
  // key: string
  // data: object
  ts: number
  isDone: boolean
  update: (err: Error | null, ts: number, isSkip: boolean) => void
}

export class InternalProcessor implements GameProcessor {
  private queue: Heap<TInternalRequest>
  constructor() {
    this.queue = new Heap((a, b) => a.ts - b.ts)
    this.queue.init([])
  }
  process(ts: number, moveTick: (ts: number) => boolean): void {
    let req = this.queue.peek()
    for (; req && req.ts <= ts && moveTick(req.ts); req=this.queue.peek()) {
      req.update(null, req.ts, req.isDone)
      req.isDone = true
      this.queue.pop()
    }
    // new Promise((ok, failed) => setTimeout(() => {failed('Stop here')}, 3))
  }

  reset(): void {
    for(let req = this.queue.pop(); req; req = this.queue.pop()) {
      req.update(null, 0, true)
      req.isDone = true
    }
    this.queue.clear()
  }

  request(msg: TInternalRequest) {
    this.queue.push(msg)
  }
}
