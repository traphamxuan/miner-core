import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';
import * as gameData from './gamedata.json'
import * as gameStatic from './static.json'
import { Game, initStatic } from '../src'

const reader = readline.createInterface({ input, output });

function warehouse_prop() {
	const unsub = game.getRender('warehouse').register({
		onSync: () => {
			const resources = game.getService('warehouse').Resources()
			console.log(`This is all resources in warehouse
${resources.map(r => `${r.id}\t${r.base.name}\t${r.amount}`).join('\n')}
	- s <Name> <number> to sell a resource in warehouse
	- b to back
			`);
		}
	}, 'warehouse_prop')
	
	reader.question('Enter your select: ', answer => {
		switch (answer) {
			case 's':
				console.log(`<Name> <number> to sell a resource in warehouse`);
				warehouse_prop();
				break;
			case 'b':
				unsub();
				showMain();
				break;
			default:
				warehouse_prop();
				break;
		}
	});
}

function factory_machines() {
	const unSub = game.getRender('factory').register({
		onSync: () => {
			const machines = game.getService('factory').Machines()
			console.log(`This is all machines in the factory
${machines.map(m => `${m.id}\t${m.base.name}\t${m.progress}\t${m.recipe?.base.target.name || ''}`).join('\n')}
	- s <machineID> <Name> to set a recipe for a machine
	- d <machineID> to remove a receipe of a machine
	- b to back
	`);
		}
	}, 'factory_machines')
	
	reader.question('Enter your select: ', answer => {
		switch (answer) {
			case 's':
				console.log(`<machineID> <Name> to set a recipe for a machine`);
				factory_machines();
				break;
			case 'd':
				console.log('<machineID> to remove a receipe of a machine');
				factory_machines();
				break;
			case 'b':
				unSub();
				showMain();
				break;
			default:
				factory_machines();
				break;
		}
	});

}

function trans_vehicles() {
	const unSub = game.getRender('miner').register({
		onSync: () => {
			const shuttles = game.getService('miner').Shuttles()
			console.log(`This is all mines with shuttles using for transportation
${shuttles.map(s => `${s.id}\t${s.base.name}\t${s.position}\t${s.load.map(l => `${l.base.name}:${l.amount}`).join(',')}`).join('\n')}
	- a <Name> to add a mine to your planet
	- m <mineID> to upgrade mine capacity
	- s <shuttleID> <power/capacity> to upgrade power or capacity of the shuttle
	- b to back
				`);
		}
	}, 'trans_vehicles')
	
	reader.question('Enter your select: ', answer => {
		switch (answer) {
			case 'a':
				console.log(`<Name> to add a mine to your planet`);
				trans_vehicles();
				break;
			case 'm':
				console.log('<mineID> to upgrade mine capacity');
				trans_vehicles();
				break;
			case 's':
				console.log(`<shuttleID> <power/capacity> to upgrade power or capacity of the shuttle`);
				trans_vehicles();
				break;
			case 'b':
				unSub();
				showMain();
				break;
			default:
				trans_vehicles();
				break;
		}
	});
}

function showMain() {
	console.log(`Welcome to ExoMiner in console version
	Main menu:
	- w: show warehouse's properties
	- f: show factory's machines
	- t: show transportation vehicles
	- q: exit the game
	`)
	reader.question('Enter your select: ', answer => {
		switch (answer) {
			case 'w':
				warehouse_prop();
				break;
			case 'f':
				factory_machines();
				break;
			case 't':
				trans_vehicles();
				break;
			case 'q':
				console.log('Goodbye!');
				reader.close();
				onExit && onExit(0);
				break;
			default:
				console.log('\u0033[2J');
				showMain();
				break;

		}
	});
}

let onExit: (value: unknown) => void
initStatic(gameStatic)
const game = new Game()

function main() {
	game.load(gameData)
	const currentTs = new Date().getTime()
	game.start(currentTs - new Date(gameData.planet.updatedAt).getTime(), currentTs)
	console.log('Re-Calculate the game...')
	game.run(new Date().getTime())
	console.log('Finish')
	const timer = setInterval(() => game.run(new Date().getTime()), 100)

	new Promise((ok) => {
		onExit = ok
		showMain()
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
