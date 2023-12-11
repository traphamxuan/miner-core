import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';
import { registerContinuousShow, showFactoryView, showMain, showMinerView, showResourceView, unregisterContinuousShow } from './view';
import { Game } from '../src';

const reader = readline.createInterface({ input, output });
let onExit: (value: unknown) => void

export function handleInputMain(game: Game, end?: (value: unknown) => void) {
  if (end) {
    onExit = end
  }
  reader.question('Enter your select: ', answer => {
		switch (answer) {
			case 'w':
				showResourceView(game)
        registerContinuousShow(game, 'resource')
        handleInputResourceView(game)
        return
			case 'f':
				showFactoryView(game)
        registerContinuousShow(game, 'factory')
        handleInputFactoryView(game)
        return
			case 't':
				showMinerView(game)
        registerContinuousShow(game, 'miner')
        handleInputMinerView(game)
				return
			case 'q':
				console.log('Goodbye!');
				// reader.close();
				onExit && onExit(0)
				return;
			default:
				console.log('\u0033[2J');
				showMain();
				break;
		}
    handleInputMain(game)
	});
}

export function handleInputResourceView(game: Game) {
  reader.question('Enter your select: ', answer => {
		const [command, ...args] = answer.split(' ')
		switch (command) {
			case 's':
				game.getInput('warehouse').requestSellResource(args[0], BigInt(args[1]))
					.catch(err => console.error(err))
				break;
			case 'b':
				unregisterContinuousShow(game, 'resource')
				showMain();
        handleInputMain(game)
        return
			default:
				showResourceView(game);
				break;
		}
    handleInputResourceView(game);
	});
}

export function handleInputFactoryView(game: Game) {
  reader.question('Enter your select: ', answer => {
    const [command, ...args] = answer.split(' ')
		switch (command) {
			case 's':
				game.getInput('factory').setMachineRecipe(args[0], args[1])
					.catch(err => console.error(err))
				break;
			case 'p':
				game.getInput('factory').upMachinePower(args[0])
					.catch(err => console.error(err))
				break;
			case 'b':
				unregisterContinuousShow(game, 'factory')
				showMain();
        handleInputMain(game);
				return;
			default:
				break;
		}
    handleInputFactoryView(game);
	});
}

export function handleInputMinerView(game: Game) {
	reader.question('Enter your select: ', answer => {
		const [command, ...args] = answer.split(' ')
		switch (command) {
			case 'a':
				game.getInput('miner').requestNewDeposit(args[0])
					.catch(err => console.error(err))
				break;
			case 'm':
				game.getInput('miner').upDepositRate(args[0])
					.catch(err => console.error(err))
				break;
			case 's':
				game.getInput('miner').upShuttleSpeed(args[0])
					.catch(err => console.error(err))
				break;
			case 'b':
				unregisterContinuousShow(game, 'miner')
				showMain();
        handleInputMain(game)
        return
			default:
				break;
		}
    handleInputMinerView(game);
	});
}