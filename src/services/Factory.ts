import { Machine, Resource } from "../entities";
import { Warehouse } from "./Warehouse";

export class Factory {
  private machines: Machine[]
  private scheduler: { machine: Machine, src: Resource }[]
  constructor(private storage: Warehouse) {
    this.machines = []
    this.scheduler = []
  }
  getMachine = (): Machine[] => this.machines
  addMachine = (machine: Machine) => this.machines.push(machine)
  setScheduler = (machine: Machine, src: Resource) => this.scheduler.push({ machine, src })
  removeScheduler = (machine: Machine) => this.scheduler = this.scheduler.filter(ms => ms.machine.id == machine.id)
}
