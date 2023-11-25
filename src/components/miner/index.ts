import { pService } from '../planet'
import { wService } from '../warehouse'
import { MinerInputManagement } from './miner.input'
import { MinerInternalEvent } from './miner.internal'
import { MinerRender } from './miner.render'
import { MinerService } from './miner.service'

export type { MinerService } from './miner.service'
export type { MinerInputManagement } from './miner.input'
export type { MinerRender } from './miner.render'
export type { MinerExternal } from './miner.external'
export type { MinerInternalEvent } from './miner.internal'

const mService = new MinerService(pService, wService)
const mInternal = new MinerInternalEvent(mService)
const mInput = new MinerInputManagement(mService, mInternal)
const mRender = new MinerRender(mService)

export { mService, mInternal, mInput, mRender }
