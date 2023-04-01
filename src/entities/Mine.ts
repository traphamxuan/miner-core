import { BaseEntity } from "../common/BaseEntity";
import { Resource } from "./Resource";

type MineProp = {
  ore: Resource
  ratio: number
  storage: number
}

export class Mine extends BaseEntity {
  distance: number
  rate: number
  resources: MineProp[]
  lastModifiedAt: Date
  constructor(distance: number, rate: number) {
    super()
    this.distance = distance
    this.rate = rate
    this.resources = []
    this.lastModifiedAt = new Date()
  }
}
