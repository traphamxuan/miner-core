import { Planet, RawPlanet } from '../../entities/'

export class PlanetService {
  planet: Planet | undefined
  constructor() {}

  get id() { return `planet-${this.planet?.id}` }

  load(rawPlanet: RawPlanet) {
    this.planet = new Planet(rawPlanet)
  }
  unload() {
    this.planet = undefined
  }
}
