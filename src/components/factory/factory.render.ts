import { Engine } from "../../core"
import { SyncProcessor, SyncService, TRenderAction } from "../../core/SyncProcessor"
import { FactoryService } from "./factory.service"

export class FactoryRender implements SyncService {
  readonly id = 'factory-render'
  private syncProcessor: SyncProcessor
  constructor(engine: Engine, private factoryService: FactoryService) {
    this.syncProcessor = engine.sync
  }
  sync(ts: number) {
    this.factoryService.Machines().forEach(machine => machine.syncedAt < ts && machine.sync(ts))
  }

  register(callback: TRenderAction, uid?: string) { return this.syncProcessor.register(this, callback, uid) }
  unregister(uid?: string) { this.syncProcessor.unregister(this, uid) }
}
