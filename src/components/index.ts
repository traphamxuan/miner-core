import { Engine } from '../core';
import { FactoryInputManagement, FactoryInternalEvent, FactoryRender, FactoryService, createFactory } from './factory';
import { MinerRender, MinerInputManagement, MinerService, MinerInternalEvent, createMiner } from './miner';
import { PlanetService } from './planet/planet.service';
import { WarehouseInputManagement, WarehouseService, createWarehouse } from './warehouse';
import { WarehouseRender } from './warehouse/warehouse.render';

export type Component = {
  service: {
    planet: PlanetService
    factory: FactoryService
    miner: MinerService
    warehouse: WarehouseService
  }
  render: {
    factory: FactoryRender
    miner: MinerRender
    warehouse: WarehouseRender
  }
  input: {
    factory: FactoryInputManagement
    miner: MinerInputManagement
    warehouse: WarehouseInputManagement
  }
  internal: {
    factory: FactoryInternalEvent
    miner: MinerInternalEvent
  }
}

export function createComponents(engine: Engine): Component {
  const pService = new PlanetService()
  const warehouse = createWarehouse(engine, pService)
  const miner = createMiner(engine, pService, warehouse.service)
  const factory = createFactory(engine, pService, warehouse.service)
  return {
    service: {
      planet: pService,
      factory: factory.service,
      miner: miner.service,
      warehouse: warehouse.service,
    },
    render: {
      factory: factory.render,
      miner: miner.render,
      warehouse: warehouse.render,
    },
    input: {
      factory: factory.input,
      miner: miner.input,
      warehouse: warehouse.input,
    },
    internal: {
      factory: factory.internal,
      miner: miner.internal,
    }
  }
}
