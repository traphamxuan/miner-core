import {describe, expect, test, beforeAll, afterEach} from '@jest/globals';
import { Game, PlanetData } from '../src';
import * as staticData from '../sample/static.json';
import { MinerService } from '../src/components/miner';
import { FactoryService } from '../src/components/factory';
import { WarehouseService } from '../src/components/warehouse';

describe('load game', () => {
  const game = new Game();
  let mService: MinerService;
  let fService: FactoryService;
  let wService: WarehouseService;

  beforeAll(async () => {
    game.init(staticData);
    mService = game.getService('miner');
    fService = game.getService('factory');
    wService = game.getService('warehouse');
  });

  afterEach(() => {
    game.unload();
  });

  test('load game with empty data', async () => {
    const rawData: PlanetData = {
      id: 'planet-1',
      name: 'Planet 1',
      money: '0',
      uid: '123',
      startedAt: 0,
      updatedAt: '',
      deposits: [],
      shuttles: [],
      resources: [],
      machines: [],
      recipes: []
    }
    game.load(rawData);

    const pService = game.getService('planet');
   
    expect(pService.planet).toBeTruthy();
    expect(pService.planet?.id).toBe('planet-1');
    expect(pService.planet?.name).toBe('Planet 1');
    expect(pService.planet?.money).toBe(BigInt(0));
    expect(pService.planet?.userId).toBe('123');
    expect(pService.planet?.startedAt).toBe(0);
  });

  test('load game with full data', async () => {
    const rawData: PlanetData = {
      id: 'planet-1',
      name: 'Planet 1',
      money: '0',
      uid: '123',
      startedAt: 0,
      updatedAt: '',
      deposits: [
        {
          pid: 'planet-1',
          sdid: '82',
          ores: [],
          rate: 5,
          syncedAt: 12,
        }
      ],
      shuttles: [
        {
          pid: 'planet-1',
          ssid: '122',
          sdid: '82',
          power: 5,
          capacity: 5,
          position: {x: 0, y: 20},
          isReturned: false,
          load: [],
          syncedAt: 12,
        }
      ],
      resources: [
        {
          pid: 'planet-1',
          srid: '1',
          amount: '1000',
          syncedAt: 20,
        }
      ],
      machines: [
        {
          pid: 'planet-1',
          smid: '221',
          sreid: '162',
          progress: 2,
          isRun: true,
          power: 1,
          syncedAt: 30,
        }
      ],
      recipes: [
        {
          pid: 'planet-1',
          sreid: '162',
          cost: 3000,
          syncedAt: 40,
        }
      ]
    }
    game.load(rawData);
    
    const pService = game.getService('planet');
    expect(pService.planet).toBeTruthy();
    expect(pService.planet?.id).toBe('planet-1');
    expect(pService.planet?.name).toBe('Planet 1');
    expect(pService.planet?.money).toBe(BigInt(0));
    expect(pService.planet?.userId).toBe('123');
    expect(pService.planet?.startedAt).toBe(0);

    const deposit = mService.Deposit('82');
    expect(mService.Deposits()).toHaveLength(1);
    expect(deposit).toBeTruthy();
    expect(deposit?.planetId).toBe('planet-1');
    expect(deposit?.base.id).toBe('82');
    expect(deposit?.rate).toBe(5);
    expect(deposit?.syncedAt).toBe(12);
    expect(deposit?.oreStorages.length).toBe(1);
    expect(deposit?.oreStorages[0].id).toBe('1');
    expect(deposit?.oreStorages[0].amount).toBe(0);

    const shuttle = mService.Shuttle('122');
    expect(mService.Shuttles()).toHaveLength(1);
    expect(shuttle).toBeTruthy();
    expect(shuttle?.planetId).toBe('planet-1');
    expect(shuttle?.base.id).toBe('122');
    expect(shuttle?.deposit?.base.id).toBe('82');
    expect(shuttle?.capacity).toBe(5);
    expect(shuttle?.position).toBe(20);
    expect(shuttle?.isReturned).toBe(false);
    expect(shuttle?.speed).toBe(5);
    expect(shuttle?.load.length).toBe(0);
    expect(shuttle?.syncedAt).toBe(12);

    const resource = wService.Resource('1');
    expect(wService.Resources()).toHaveLength(1);
    expect(resource).toBeTruthy();
    expect(resource?.planetId).toBe('planet-1');
    expect(resource?.base.id).toBe('1');
    expect(resource?.amount).toBe(BigInt(1000));
    expect(resource?.syncedAt).toBe(20);

    const machine = fService.Machine('221');
    expect(fService.Machines()).toHaveLength(1);
    expect(machine).toBeTruthy();
    expect(machine?.planetId).toBe('planet-1');
    expect(machine?.base.id).toBe('221');
    expect(machine?.recipe?.base.id).toBe('162');
    expect(machine?.progress).toBe(2);
    expect(machine?.isRun).toBe(true);
    expect(machine?.speed).toBe(1);
    expect(machine?.syncedAt).toBe(30);

    const recipe = fService.Recipe('162');
    expect(fService.Recipes()).toHaveLength(1);
    expect(recipe).toBeTruthy();
    expect(recipe?.planetId).toBe('planet-1');
    expect(recipe?.base.id).toBe('162');
    expect(recipe?.cost).toBe(3000);
    expect(recipe?.syncedAt).toBe(40);
  });
})
