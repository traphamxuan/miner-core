import { BaseEntity } from "../common/BaseEntity";
import { Mine } from "./Mine";

export class Shuttle extends BaseEntity {
  target: Mine | undefined
  constructor(public power: number, public capacity: number, target?: Mine) {
    super()
    this.target = target
  }
}
