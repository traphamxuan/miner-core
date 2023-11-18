import { Heap } from 'heap-js';
import { GameProcessor } from '../common/interfaces/GameProcessor.js';

export type TExternalRequest = {
  id: string
  // key: string
  // data: object
  ts: number
  isDone: boolean
  update: (err: Error | null, ts: number) => void
}

export class ExternalProcessor implements GameProcessor {
  private queue: Heap<TExternalRequest>
  constructor() {
    this.queue = new Heap((a, b) => a.ts - b.ts)
    this.queue.init([])
  }
  process(ts: number, moveTick?: (ts: number) => void): void {
    let req = this.queue.peek()
    for (; req && req.ts <= ts; req.isDone = true, this.queue.pop(), req = this.queue.peek()) {
      if (req.isDone) continue
      moveTick && moveTick(req.ts)
      req.update(null, ts)
    }
  }

  reset(): void {
    for (let req = this.queue.pop(); req; req = this.queue.pop()) {
      req.update(new Error('Reset command'), 0)
      req.isDone = true
    }
    this.queue.clear()
  }

  async request(msg: TExternalRequest) {
    this.queue.push(msg)
  }
}
