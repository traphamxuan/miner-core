import { Engine } from '../core';
import { FactoryInputManagement, FactoryInternalEvent, FactoryRender, FactoryService, createFactory } from './factory';
import { MinerRender, MinerInputManagement, MinerService, MinerInternalEvent, createMiner } from './miner';
import { PlanetService } from './planet/planet.service';
import { StaticService } from './static/static.service';
import { WarehouseInputManagement, WarehouseService, createWarehouse } from './warehouse';
import { WarehouseInternalEvent } from './warehouse/warehouse.internal';
import { WarehouseRender } from './warehouse/warehouse.render';

export type Component = {
  service: {
    planet: PlanetService
    factory: FactoryService
    miner: MinerService
    warehouse: WarehouseService
    static: StaticService
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
    warehouse: WarehouseInternalEvent
  }
}

export enum ActionCommand {
  BUY = "BUY",
  SELL = "SELL",
  UP_POW = "UP_POW",
  UP_CAP = "UP_CAP",
  SET = "SET",
}

export function createComponents(engine: Engine): Component {
  const pService = new PlanetService()
  const sService = new StaticService()
  const warehouse = createWarehouse(engine, pService, sService)
  const miner = createMiner(engine, pService, warehouse.service, sService)
  const factory = createFactory(engine, pService, warehouse.service, sService)
  return {
    service: {
      planet: pService,
      factory: factory.service,
      miner: miner.service,
      warehouse: warehouse.service,
      static: sService,
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
      warehouse: warehouse.internal,
    }
  }
}
