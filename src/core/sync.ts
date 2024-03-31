import type { GameProcessor } from './loop'
import { SubEvent, isEmptyObject } from '../common'

export class SyncProcessor implements GameProcessor {
  readonly Name = SyncProcessor.name
  private subEvent: SubEvent<TRenderAction>

  private syncQueue: Record<string, {
    service: SyncService,
  }>
  constructor() {
    this.syncQueue = {}
    this.subEvent = new SubEvent()
  }

  process(ts: number, _?: number): number {
    const syncList = Object.values(this.syncQueue)
    syncList.forEach(q => {
      q.service.sync(ts)
      this.subEvent.dispatchEvent(q.service.id, 'onSync', ts)
    })
    return ts
  }

  reset(): void {}


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
