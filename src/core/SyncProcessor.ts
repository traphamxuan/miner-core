import { SubEvent } from '../common/services/SubEvent.js'
import { GameProcessor } from '../common/interfaces/GameProcessor.js'
import { isEmptyObject } from '../common/utils'

export interface SyncService {
  id: string
  sync(ts: number): void
}

export type TRenderAction = {
  onSync: (id: string, ts: number) => void
}

export class SyncProcessor implements GameProcessor {
  private subEvent: SubEvent<TRenderAction>

  private syncQueue: Record<string, {
    service: SyncService,
  }>
  constructor() {
    this.syncQueue = {}
    this.subEvent = new SubEvent()
  }

  process(ts: number): void {
    const syncList = Object.values(this.syncQueue)
    syncList.forEach(q => {
      q.service.sync(ts)
      this.subEvent.dispatchEvent(q.service.id, 'onSync', ts)
    })
  }

  reset(): void {
    this.syncQueue = {}
  }


  register(service: SyncService, action: TRenderAction, uid?: string) {
    this.syncQueue[service.id] = { service }
    return this.subEvent.registerChange(service.id, uid, action)
  }
  unregister(service: SyncService, uid?: string) {
    this.subEvent.unregisterChange(service.id, uid)
    if (!uid || isEmptyObject(this.syncQueue[service.id])) {
      delete this.syncQueue[service.id]
    }
  }
}
