import * as gameData from './gamedata.json'
import * as gameStatic from './static.json'
import { Game, initStatic } from '../src'
import { showMain } from './view';
import { handleInputMain } from './input';

initStatic(gameStatic)
const game = new Game()

function main() {
	game.load(gameData)
	const currentTs = new Date().getTime()
	game.start(currentTs)
	console.log('Re-Calculate the game...')
	game.run(currentTs)
	console.log('Finish')
	const timer = setInterval(() => game.run(new Date().getTime()), 100)

	showMain()
	new Promise((ok) => {
		handleInputMain(game, ok)
	})
		.then(() => {
			clearInterval(timer)
			game.unload()
		})
}

main();
/*
 * Welcome to ExoMiner in console version
 * Main menu:
 * - w: show warehouse's properties
 * - f: show factory's machines
 * - t: show transportation vehicles
 * - q: exit the game
 * 
 * W --> 
 * This is all resources in warehouse
 * - s <Name> <number> to sell a resource in warehouse
 * - b to back
 * 
 * F -->
 * This is all machines in the factory
 * - s <machineID> <Name> to set a recipe for a machine
 * - d <machineID> to remove a receipe of a machine
 * - b to back
 * 
 * T -->
 * This is all mines with shuttles using for transportation
 * - a <Name> to add a mine to your planet
 * - m <mineID> to upgrade mine capacity
 * - s <shuttleID> <power/capacity> to upgrade power or capacity 
 * of the shuttle
 * - b to back
 * 
 */
