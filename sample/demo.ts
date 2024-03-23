import readline from 'readline';

import * as inputs from './inputs.json'
import * as gameData from './gamedata.json'
// import * as gameStatic from './static.json'
import { Action, Game } from '../src'
import { registerContinuousShow, showMain, toTimeAmount, unregisterContinuousShow } from './view';
import { writeFileSync } from 'fs';
import { ActionCommand } from '../src/common/enum';

const game = new Game()
let inputText = ''
const userInputs: Action[] = inputs.actions.map((action: Omit<Action, 'command'> & { command: string }) => ({
	...action,
	command: ActionCommand[action.command as keyof typeof ActionCommand],
}))

function main() {
	game.init(gameData.static)
	game.load({
		...gameData.planet,
		deposits: gameData.planet.deposits.map((deposit) => ({
			...deposit,
			pid: gameData.planet.id,
		})),
		shuttles: gameData.planet.shuttles.map((shuttle) => ({
			...shuttle,
			load: shuttle.load || [],
			pid: gameData.planet.id,
		})),
		resources: gameData.planet.resources.map((resource) => ({
			...resource,
			pid: gameData.planet.id,
		})),
		machines: gameData.planet['machines']?.map((machine) => ({
			...machine,
			pid: gameData.planet.id,
		})) || [],
		recipes: gameData.planet['recipes']?.map((recipe) => ({
			...recipe,
			pid: gameData.planet.id,
		})) || [],
	})
	game.loadInput(userInputs)
	registerContinuousShow(game)
	let tick = new Date().getTime() - gameData.planet.startedAt
	console.log(`Re-Calculate the game to ${tick}...`)
	let currentTick = 0;
	while (currentTick < tick) {
		currentTick = game.run(tick, 10000)
		console.log(`Progress ${toTimeAmount(currentTick).timeString}\t/${toTimeAmount(tick).timeString} \t(${(currentTick / tick * 100).toFixed(3)}%)...`)
	}
	console.log('Finish')
	const period = 30
	const timer = setInterval(() => {
		showMain(game)
		console.log('Commands:', inputText)
		tick += period;
		game.run(tick)
	}, period)

	showMain(game)

	// Read every character via reader
	readline.emitKeypressEvents(process.stdin as NodeJS.ReadableStream);
	process.stdin.setRawMode(true);

	// Read every character
	process.stdin.on('keypress', (str, key) => {
		if (key.ctrl && key.name === 'c') {
			clearInterval(timer);
			unregisterContinuousShow(game);
			game.unload();
			writeFileSync(`${__dirname}/inputs.json`, JSON.stringify({ actions: userInputs }, null, 2))
			process.exit(); // Exit the process if Ctrl+C is pressed
		}
		if (key.name === 'backspace') {
			inputText = inputText.slice(0, -1)
			return
		}
		if (key.name === 'return') {
			inputText.trim()
			console.log('Process command', inputText)
			const inputs = inputText.split(';')
			const loadInputs: Action[] = []
			for (const input of inputs) {
				const [target, command, ...args] = input.trim().split(' ')
				if (target === '' || command === '') {
					continue
				}
				const action: Action = {
					target,
					command: ActionCommand[command as keyof typeof ActionCommand],
					createdAt: 0,
					params: args,
				}
				loadInputs.push(action)
			}
			inputText = ''
			Promise.all(game.loadInput(loadInputs)).then((results) => {
				if (results.length === 0) {
					console.log('Invalid command')
					return
				}
				results.forEach((result, index) => {
					loadInputs[index].createdAt = result.syncedAt
					userInputs.push(loadInputs[index])
				})
			}).catch(err => {
				console.error(err)
			})
			inputText = ''
			return
		}
		inputText += str
	});
}

main();
