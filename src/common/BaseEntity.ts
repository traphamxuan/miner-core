export class BaseEntity {
  constructor(private _id = new Date().getTime().toString(32)) {}
  get id() { return this._id }
}