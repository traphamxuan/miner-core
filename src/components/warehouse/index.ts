import { pService } from '../planet'
import { WarehouseInputManagement } from './warehouse.input'
import { WarehouseRender } from './warehouse.render'
import { WarehouseService } from './warehouse.service'

export type { WarehouseService } from './warehouse.service'
export type { WarehouseInputManagement } from './warehouse.input'

const wService = new WarehouseService(pService)
const wInput = new WarehouseInputManagement(pService, wService)
const wRender = new WarehouseRender(wService)

export { wService, wInput, wRender }