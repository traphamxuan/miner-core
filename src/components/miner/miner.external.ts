import { MinerInputManagement } from "./miner.input";
import { MinerInternalEvent } from "./miner.internal";
import { MinerService } from "./miner.service";
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
  }
}
