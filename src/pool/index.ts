import { FactoryService } from './factory.service'
import { MinerService } from './miner.service'
import { PlanetService } from './planet.service'
import { StaticService } from './static.service'
import { WarehouseService } from './warehouse.service'

export const createPool = () => {
  const pService = new PlanetService()
  const sService = new StaticService()
  const wService = new WarehouseService(pService, sService)
  const mService = new MinerService(pService, wService)
  const fService = new FactoryService(pService, wService)
  return {
    planet: pService,
    factory: fService,
    miner: mService,
    warehouse: wService,
    static: sService,
  }
}

export { PlanetService } from './planet.service'
export { StaticService } from './static.service'
export { WarehouseService } from './warehouse.service'
export { MinerService } from './miner.service'
export { FactoryService } from './factory.service'
