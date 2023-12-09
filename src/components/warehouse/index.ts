import { Engine, InputProcessor, SyncProcessor } from '@/core'
import { PlanetService } from '../planet/planet.service'
import { WarehouseInputManagement } from './warehouse.input'
import { WarehouseRender } from './warehouse.render'
import { WarehouseService } from './warehouse.service'

export type { WarehouseService } from './warehouse.service'
export type { WarehouseInputManagement } from './warehouse.input'

export function createWarehouse(
  engine: Engine,
  pService: PlanetService,
): {
  service: WarehouseService,
  input: WarehouseInputManagement,
  render: WarehouseRender,
} {
  const service = new WarehouseService(pService)
  const input = new WarehouseInputManagement(engine, pService, service)
  const render = new WarehouseRender(engine, service)

  return {
    service,
    input,
    render,
  }
}
