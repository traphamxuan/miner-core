import { SyncService } from "../../core/SyncProcessor"
import { FactoryService } from "./factory.service"
import { syncProcessor } from "../../core"

export class FactoryRender implements SyncService {
  constructor(private factoryService: FactoryService) {}
  sync(ts: number) {
    this.factoryService.Machines().forEach(machine => machine.syncedAt < ts && machine.sync(ts))
  }

  register(callback?: (ts: number) => void) { syncProcessor.register(this.factoryService.id, this, callback) }
  unregister() { syncProcessor.unregister(this.factoryService.id) }
}
