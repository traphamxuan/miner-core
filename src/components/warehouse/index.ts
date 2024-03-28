import { Engine } from '../../core'
import { PlanetService } from '../planet/planet.service'
import { StaticService } from '../static/static.service'
import { WarehouseInputManagement } from './warehouse.input'
import { WarehouseInternalEvent } from './warehouse.internal'
import { WarehouseRender } from './warehouse.render'
import { WarehouseService } from './warehouse.service'

export type { WarehouseService } from './warehouse.service'
export type { WarehouseInputManagement } from './warehouse.input'

export function createWarehouse(
  engine: Engine,
  pService: PlanetService,
  sService: StaticService,
): {
  service: WarehouseService,
  input: WarehouseInputManagement,
  render: WarehouseRender,
  internal: WarehouseInternalEvent,
} {
  const service = new WarehouseService(pService, sService)
  const internal = new WarehouseInternalEvent(engine, service)
  const input = new WarehouseInputManagement(engine, service, internal)
  const render = new WarehouseRender(engine, service)

  return {
    service,
    input,
    render,
    internal,
  }
}
