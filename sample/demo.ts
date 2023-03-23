import { Planet } from '../src'

const planet = Planet.register()
console.log(`Welcome to ExoMiner in console version
Main menu:
- W: show warehouse's properties
- F: show factory's machines
- T: show transportation vehicles
- Q: exit the game
`)
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
