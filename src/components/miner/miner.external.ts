import { MinerInputManagement, MinerInternalEvent, MinerService } from ".";
import { BaseExternalEvent } from "../../common/interfaces/BaseExternalEvent";

export class MinerExternal extends BaseExternalEvent {
  constructor(
    private minerService: MinerService,
    private minerInternal: MinerInternalEvent,
    private minerInput: MinerInputManagement,
  ) {
    super()
  }
  onCreateMiner(oldDepositId: string, depositId: string, oldShuttleId: string, shuttleId: string) {
    this.minerInternal.updateMinerID(oldShuttleId, shuttleId)
  }
}
