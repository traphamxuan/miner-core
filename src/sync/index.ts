import { FactoryService, MinerService, WarehouseService } from "../pool"
import { FactoryRender } from "./factory.render"
import { MinerRender } from "./miner.render"
import { SyncProcessor } from "./sync"
import { WarehouseRender } from "./warehouse.render"

export const createSync = (
  fService: FactoryService,
  mService: MinerService,
  wService: WarehouseService,
) => {
  const sync = new SyncProcessor()
  return {
    sync,
    factory: new FactoryRender(sync, fService),
    miner: new MinerRender(sync, mService),
    warehouse: new WarehouseRender(sync, wService),
  }
}