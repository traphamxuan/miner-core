import { FactoryService, MinerService, StaticService, WarehouseService } from "../pool"
import { EventProcessor } from "../core"
import { FactoryInternalEvent } from "./factory.event"
import { MinerInternalEvent } from "./miner.event"
import { WarehouseInternalEvent } from "./warehouse.event"

export const createEvents = (
  event: EventProcessor,
  sService: StaticService,
  mService: MinerService,
  fService: FactoryService,
  wService: WarehouseService,
) => {
  return {
    event,
    factory: new FactoryInternalEvent(event, sService, fService, wService),
    miner: new MinerInternalEvent(event, sService, mService),
    warehouse: new WarehouseInternalEvent(event, wService),
  }
}

export { FactoryInternalEvent } from "./factory.event"
export { MinerInternalEvent } from "./miner.event"
export { WarehouseInternalEvent } from "./warehouse.event"