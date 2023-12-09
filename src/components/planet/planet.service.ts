import { QuickAccessStore } from '../../common/services/QuickAccessStore'
import { Planet } from '../../entities/'

export class PlanetService {
  private planets: QuickAccessStore<Planet>
  planet: Planet | undefined
  constructor() {
    this.planets = new QuickAccessStore()
  }
  get id() { return `planet-${this.planet?.id}` }
  Planets() { return this.planets.getStores() }
  Planet(id: string) { return this.planets.getOne(id) }
  reset() { this.planets.reset() }

  runningPlanet() { return this.planet }

  addPlanet(planet: Planet): Planet {
    this.planets.add(planet, [planet.id, planet.name])
    return planet
  }

  load(planetId: string): Error | Planet {
    const planet = this.Planet(planetId)
    if (!planet) {
      return new Error('Planet does not exist')
    }
    this.planet = planet
    return planet
  }
  unload() {
    this.planet = undefined
  }
}
