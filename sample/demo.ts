import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';

import { Planet } from '../src'

const planet = Planet.register()


const reader = readline.createInterface({ input, output });

function warehouse_prop() {
	console.log(`This is all resources in warehouse
	- S <Name> <number> to sell a resource in warehouse
	- B to back
	`);
	reader.question('Enter your select: ', answer => {
		switch (answer) {
			case 'S':
				console.log(`<Name> <number> to sell a resource in warehouse`);
				warehouse_prop();
				break;
			case 'B':
				main();
				break;
			default:
				warehouse_prop();
				break;
		};
	});
}

function factory_machines(){
	console.log(`This is all machines in the factory
	- S <machineID> <Name> to set a recipe for a machine
	- D <machineID> to remove a receipe of a machine
	- B to back
	`);
	reader.question('Enter your select: ', answer => {
		switch (answer) {
			case 'S':
				console.log(`<machineID> <Name> to set a recipe for a machine`);
				factory_machines();
				break;
			case 'D':
				console.log('<machineID> to remove a receipe of a machine');
				factory_machines();
				break;
			case 'B':
				main();
				break;
			default:
				factory_machines();
				break;
		};
	});

}

function trans_vehicles() {
	console.log(`This is all mines with shuttles using for transportation
	- A <Name> to add a mine to your planet
	- M <mineID> to upgrade mine capacity
	- S <shuttleID> <power/capacity> to upgrade power or capacity of the shuttle
	- B to back
	`);
	reader.question('Enter your select: ', answer => {
		switch (answer) {
			case 'A':
				console.log(`<Name> to add a mine to your planet`);
				trans_vehicles();
				break;
			case 'M':
				console.log('<mineID> to upgrade mine capacity');
				trans_vehicles();
				break;
			case 'S':
				console.log(`<shuttleID> <power/capacity> to upgrade power or capacity of the shuttle`);
				trans_vehicles();
				break;
			case 'B':
				main();
				break;
			default:
				trans_vehicles();
				break;
		};
	});

}
function main() {
	console.log(`Welcome to ExoMiner in console version
	Main menu:
	- W: show warehouse's properties
	- F: show factory's machines
	- T: show transportation vehicles
	- Q: exit the game
	`)
	reader.question('Enter your select: ', answer => {
		switch (answer) {
			case 'W':
				warehouse_prop();
				break;
			case 'F':
				factory_machines();
				break;
			case 'T':
				trans_vehicles();
				break;
			case 'Q':
				console.log('Goodbye!');
				reader.close();
				break;
			default:
				console.log('\u033[2J');
				main();
				break;
  
		};
	});
}

main()
/*
 * Welcome to ExoMiner in console version
 * Main menu:
 * - W: show warehouse's properties
 * - F: show factory's machines
 * - T: show transportation vehicles
 * - Q: exit the game
 * 
 * W --> 
 * This is all resources in warehouse
 * - S <Name> <number> to sell a resource in warehouse
 * - B to back
 * 
 * F -->
 * This is all machines in the factory
 * - S <machineID> <Name> to set a recipe for a machine
 * - D <machineID> to remove a receipe of a machine
 * - B to back
 * 
 * T -->
 * This is all mines with shuttles using for transportation
 * - A <Name> to add a mine to your planet
 * - M <mineID> to upgrade mine capacity
 * - S <shuttleID> <power/capacity> to upgrade power or capacity 
 * of the shuttle
 * - B to back
 * 
 */
