import { Game } from "../src";
import { UnSubEvent } from "../src/common/services/SubEvent";

export function showMain() {
  console.log(`Welcome to ExoMiner in console version
Main menu:
- w: show warehouse's properties
- f: show factory's machines
- t: show transportation vehicles
- q: exit the game
`)
}

export function showResourceView(game: Game) {
  const resources = game.getService('warehouse').Resources()
  console.log(`This is all resources in warehouse
${resources.map(r => `${r.base.id}\t${r.base.name}\t${r.amount}`).join('\n')}
- s <Name/ID> <number> to sell a resource in warehouse
- b to back
`);
}

export function showFactoryView(game: Game) {
  const machines = game.getService('factory').Machines()
  console.log(`This is all machines in the factory
${machines.map(m => `${m.base.id}\t${m.base.name}\t${m.progress}\t${m.recipe?.base.target.name || ''}`).join('\n')}
  - a m <machineID> <Name> to buy a machine
  - a r <recipeID> <Name> to buy a recipe
	- s <machineID> <Name> to set a recipe for a machine
	- d <machineID> to remove a receipe of a machine
	- b to back
`);
}

export function showMinerView(game: Game) {
  const shuttles = game.getService('miner').Shuttles()
  console.log(`This is all mines with shuttles using for transportation
${shuttles.map(s => `${s.base.id}\t${s.base.name}\t${s.position}\t${s.syncedAt}\t${s.load.map(l => `${l.base.name}:${l.amount}`).join(',')}`).join('\n')}
- a <Name/ID> to add a mine to your planet
- m <mineID> to upgrade mine capacity
- s <shuttleID> <power/capacity> to upgrade power or capacity of the shuttle
- b to back
`);
}

export function registerContinuousShow(game: Game, type: 'resource' | 'miner' | 'factory'): UnSubEvent {
  let error: never
  switch (type) {
    case 'resource':
      return game.getRender('warehouse').register({ onSync: () => showResourceView(game) }, 'warehouse-rendering')
    case 'factory':
      return game.getRender('factory').register({ onSync: () => showFactoryView(game) }, 'factory-rendering')
    case 'miner':
      return game.getRender('miner').register({ onSync: () => showMinerView(game) }, 'miner-rendering')
    default:
      error = type
      throw new Error('Invalid command for registering')
  }
}

export function unregisterContinuousShow(game: Game, type: 'resource' | 'miner' | 'factory'): void {
  let error: never
  switch (type) {
    case 'resource':
      game.getRender('warehouse').unregister('warehouse-rendering')
      break
    case 'factory':
      game.getRender('factory').unregister('factory-rendering')
      break
    case 'miner':
      game.getRender('miner').unregister('miner-rendering')
      break
    default:
      error = type
      throw new Error('Invalid command for registering')
  }
}