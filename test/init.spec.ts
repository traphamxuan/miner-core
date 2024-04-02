import {describe, expect, test, beforeAll} from '@jest/globals';
import { Game } from '../src';
import * as staticData from '../sample/static.json';

describe('init game', () => {
  const game = new Game();
  beforeAll(async () => {

  });
  test('init game', async () => {
    game.init(staticData);
    expect(game).toBeTruthy();

    const sResources = game.getService('static').getMany('resource');
    const sDeposits = game.getService('static').getMany('deposit');
    const sShuttles = game.getService('static').getMany('shuttle');
    const sRecipes = game.getService('static').getMany('recipe');
    const sMachines = game.getService('static').getMany('machine');
    expect(sResources).toHaveLength(staticData.resources.length);
    expect(sDeposits).toHaveLength(staticData.deposits.length);
    expect(sShuttles).toHaveLength(staticData.shuttles.length);
    expect(sRecipes).toHaveLength(staticData.recipes.length);
    expect(sMachines).toHaveLength(staticData.machines.length);
    
    sResources.forEach((resource, index) => {
      const originalData = staticData.resources[index];
      expect(resource.id).toBe(originalData.id);
      expect(resource.name).toBe(originalData.name);
      expect(resource.category).toBe(originalData.category);
      expect(resource.value.toString()).toBe(originalData.value);
      expect(resource.weight).toBe(originalData.weight);
      expect(resource.icon).toBe(originalData.icon);
    })

    sDeposits.forEach((deposit, index) => {
      const originalData = staticData.deposits[index];
      expect(deposit.id).toBe(originalData.id);
      expect(deposit.name).toBe(originalData.name);
      expect(deposit.ores).toHaveLength(originalData.ores.length);
      deposit.ores.forEach((ore, index) => {
        const originalOre = originalData.ores[index];
        expect(ore.ratio).toBe(originalOre.ratio);
        expect(ore.resource.id).toBe(originalOre.srid);
      })
      expect(deposit.icon).toBe(originalData.icon);
      expect(deposit.rate).toBe(originalData.rate);
      expect(deposit.price.toString()).toBe(originalData.price);
      expect(deposit.position).toEqual(originalData.position);
    })

    sShuttles.forEach((shuttle, index) => {
      const originalData = staticData.shuttles[index];
      expect(shuttle.id).toBe(originalData.id);
      expect(shuttle.name).toBe(originalData.name);
      expect(shuttle.power).toBe(originalData.power);
      expect(shuttle.capacity).toBe(originalData.capacity);
      expect(shuttle.price.toString()).toBe(originalData.price);
    })

    sRecipes.forEach((recipe, index) => {
      const originalData = staticData.recipes[index];
      expect(recipe.id).toBe(originalData.id);
      expect(recipe.cost).toBe(originalData.cost);
      expect(recipe.price.toString()).toBe(originalData.price);
      expect(recipe.ingredients).toHaveLength(originalData.ingredients.length);
      recipe.ingredients.forEach((ingredient, index) => {
        const originalIngredient = originalData.ingredients[index];
        expect(ingredient.amount.toString()).toBe(originalIngredient.amount);
        expect(ingredient.id).toBe(originalIngredient.srid);
      })
    })

    sMachines.forEach((machine, index) => {
      const originalData = staticData.machines[index];
      expect(machine.id).toBe(originalData.id);
      expect(machine.name).toBe(originalData.name);
      expect(machine.power).toBe(originalData.power);
      expect(machine.price.toString()).toBe(originalData.price);
    })
  });
})
