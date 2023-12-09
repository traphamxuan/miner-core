import { Engine } from '@/core';
import { FactoryInputManagement, FactoryInternalEvent, FactoryRender, FactoryService, createFactory } from './factory';
import { MinerRender, MinerInputManagement, MinerService, MinerInternalEvent, createMiner } from './miner';
import { PlanetService } from './planet/planet.service';
import { WarehouseInputManagement, WarehouseService, createWarehouse } from './warehouse';
import { WarehouseRender } from './warehouse/warehouse.render';

export type Component = {
  planet: {
    service: PlanetService
  }
  factory: {
    render: FactoryRender
    input: FactoryInputManagement
    service: FactoryService
    internal: FactoryInternalEvent
  }
  miner: {
    render: MinerRender
    input: MinerInputManagement
    service: MinerService
    internal: MinerInternalEvent
  }
  warehouse: {
    render: WarehouseRender
    input: WarehouseInputManagement
    service: WarehouseService
  }
}

export function createComponents(engine: Engine): Component {
  const pService = new PlanetService()
  const warehouse = createWarehouse(engine, pService)
  const miner = createMiner(engine, pService, warehouse.service)
  const factory = createFactory(engine, pService, warehouse.service)
  return {
    planet: { service: pService },
    warehouse,
    miner,
    factory,
  }
}
