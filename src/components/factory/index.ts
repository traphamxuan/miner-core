import { pService } from '../planet'
import { wService } from '../warehouse'
import { FactoryInputManagement } from './factory.input'
import { FactoryInternalEvent } from './factory.internal'
import { FactoryRender } from './factory.render'
import { FactoryService } from './factory.service'

export type { FactoryService } from './factory.service'
export type { FactoryInputManagement } from './factory.input'
export type { FactoryRender } from './factory.render'
export type { FactoryExternal } from './factory.external'
export type { FactoryInternalEvent } from './factory.internal'

const fService = new FactoryService(pService, wService)
const fInternal = new FactoryInternalEvent(fService, wService)
const fInput = new FactoryInputManagement(fService, fInternal)
const fRender = new FactoryRender(fService)

export { fRender, fService, fInternal, fInput }
