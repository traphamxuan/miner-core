import { FactoryInputManagement } from "./factory.input"
import { InputProcessor } from "./input"
import { MinerInputManagement } from "./miner.input"
import { WarehouseInputManagement } from "./warehouse.input"

import { MinerInternalEvent } from "../event"
import { FactoryInternalEvent } from "../event"
import { WarehouseInternalEvent } from "../event"

export const creatInputs = (
  mEvent: MinerInternalEvent,
  fEvent: FactoryInternalEvent,
  wEvent: WarehouseInternalEvent,
) => {
  const input = new InputProcessor()
  return {
    input,
    factory: new FactoryInputManagement(input, fEvent),
    miner: new MinerInputManagement(input, mEvent),
    warehouse: new WarehouseInputManagement(input, wEvent),
  }
}

export { FactoryInputManagement } from "./factory.input"
export { MinerInputManagement } from "./miner.input"
export { WarehouseInputManagement } from "./warehouse.input"
