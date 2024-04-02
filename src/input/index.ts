import { InputProcessor } from "../core"

import { MinerInternalEvent } from "../event"
import { FactoryInternalEvent } from "../event"
import { WarehouseInternalEvent } from "../event"

import { FactoryInputManagement } from "./factory.input"
import { MinerInputManagement } from "./miner.input"
import { WarehouseInputManagement } from "./warehouse.input"

export const creatInputs = (
  input: InputProcessor,
  mEvent: MinerInternalEvent,
  fEvent: FactoryInternalEvent,
  wEvent: WarehouseInternalEvent,
) => {
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
