import { Engine, GameLoop, InputProcessor, InternalProcessor, SyncProcessor } from '../../core'
import { PlanetService } from '../planet/planet.service'
import { StaticService } from '../static/static.service'
import { WarehouseService } from '../warehouse'
import { FactoryInputManagement } from './factory.input'
import { FactoryInternalEvent } from './factory.internal'
import { FactoryRender } from './factory.render'
import { FactoryService } from './factory.service'

export type { FactoryService } from './factory.service'
export type { FactoryInputManagement } from './factory.input'
export type { FactoryRender } from './factory.render'
export type { FactoryExternal } from './factory.external'
export type { FactoryInternalEvent } from './factory.internal'

export function createFactory(
  engine: Engine,
  pService: PlanetService,
  wService: WarehouseService,
  sService: StaticService,
): {
  service: FactoryService,
  internal: FactoryInternalEvent,
  input: FactoryInputManagement,
  render: FactoryRender
} {
  const service = new FactoryService(pService, wService)
  const internal = new FactoryInternalEvent(engine, service, wService)
  const input = new FactoryInputManagement(engine, sService, internal)
  const render = new FactoryRender(engine, service)
  return {
    service,
    internal,
    input,
    render,
  }
}
