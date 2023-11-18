import { GameProcessor } from '../common/interfaces/GameProcessor.js'

export interface SyncService {
  sync(ts: number): void
}

export class SyncProcessor implements GameProcessor {
  private syncQueue: Record<string, {
    service: SyncService,
    callback?: (ts: number) => void
  }>
  constructor() {
    this.syncQueue = {}
  }

  process(ts: number): void {
    const syncList = Object.values(this.syncQueue)
    syncList.forEach(q => {
      q.service.sync(ts)
      q.callback && q.callback(ts)
    })
  }

  reset(): void {
    this.syncQueue = {}
  }

  register(key: string, service: SyncService, callback?: (ts: number) => void) {
    this.syncQueue[key] = { service, callback }
  }

  unregister(key: string) {
    delete this.syncQueue[key]
  }
}
