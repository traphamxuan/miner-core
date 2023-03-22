import { Mine, Shuttle } from "../entities";
import { Warehouse } from "./Warehouse";

export class Transporter {
  shuttles: Shuttle[]
  mines: Mine[]
  private sheduler: { shuttle: Shuttle, mine: Mine }[]
  constructor(private storage: Warehouse) {
    this.shuttles = []
    this.mines = []
    this.sheduler = []
  }
  addMine() {}
}
