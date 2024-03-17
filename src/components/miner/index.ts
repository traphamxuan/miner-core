import { Engine } from '../../core'
import { PlanetService } from '../planet/planet.service'
import { StaticService } from '../static/static.service'
import { WarehouseService } from '../warehouse'
import { MinerInputManagement } from './miner.input'
import { MinerInternalEvent } from './miner.internal'
import { MinerRender } from './miner.render'
import { MinerService } from './miner.service'

export type { MinerService } from './miner.service'
export type { MinerInputManagement } from './miner.input'
export type { MinerRender } from './miner.render'
export type { MinerExternal } from './miner.external'
export type { MinerInternalEvent } from './miner.internal'

export function createMiner(
  engine: Engine,
  pService: PlanetService,
  wService: WarehouseService,
  sService: StaticService,
): {
  service: MinerService,
  internal: MinerInternalEvent,
  input: MinerInputManagement,
  render: MinerRender
} {
  const service = new MinerService(pService, wService)
  const internal = new MinerInternalEvent(engine, service)
  const input = new MinerInputManagement(engine, service, internal, sService)
  const render = new MinerRender(engine, service)
  return {
    service,
    internal,
    input,
    render,
  }
}
