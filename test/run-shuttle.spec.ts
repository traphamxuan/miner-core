import {describe, expect, test, beforeAll, afterEach, afterAll} from '@jest/globals';
import { Game, GameData } from '../src';
import * as staticData from '../sample/static.json';
import { MinerService } from '../src/components/miner';
import { FactoryService } from '../src/components/factory';
import { WarehouseService } from '../src/components/warehouse';

describe('run shuttle', () => {
  const game = new Game();
  let mService: MinerService;
  let fService: FactoryService;
  let wService: WarehouseService;

  beforeAll(async () => {
    game.init(staticData);
    mService = game.getService('miner');
    fService = game.getService('factory');
    wService = game.getService('warehouse');

    game.getRender('miner').register({ onSync: () => {} }, 'render miner for testing');
    game.getRender('factory').register({ onSync: () => {} }, 'render factory for testing');
    game.getRender('warehouse').register({ onSync: () => {} }, 'render warehouse for testing');
  });

  afterAll(() => {
    game.getRender('miner').unregister('render miner for testing');
    game.getRender('factory').unregister('render factory for testing');
    game.getRender('warehouse').unregister('render warehouse for testing');
    game.deinit();
  })

  afterEach(() => {
    game.unload();
  });

  test('run 1 shuttle first half trip', async () => {
    const rawData: GameData = {
      planet: {
        id: 'planet-1',
        name: 'Planet 1',
        money: '0',
        uid: '123',
        startedAt: 0,
        updatedAt: ''
      },
      deposits: [
        {
          pid: 'planet-1',
          sdid: '82',
          ores: [],
          rate: 5,
          syncedAt: 0,
        }
      ],
      shuttles: [
        {
          pid: 'planet-1',
          ssid: '122',
          sdid: '82',
          power: 5,
          capacity: 5,
          position: {x: 0, y: 0},
          isReturned: false,
          load: [],
          syncedAt: 0,
        }
      ],
      resources: [],
      machines: [],
      recipes: []
    }
    game.load(rawData);
    game.run(2000); // Advanced to 10th second

    expect(mService.Shuttles()).toHaveLength(1);

    const shuttle = mService.Shuttle('122');
    const deposit = shuttle?.deposit;

    expect(deposit).toBeTruthy();
    expect(shuttle).toBeTruthy();
    expect(shuttle?.planetId).toBe('planet-1');
    expect(shuttle?.base.id).toBe('122');
    expect(shuttle?.deposit?.base.id).toBe('82');
    expect(shuttle?.capacity).toBe(5);
    expect(shuttle?.position).toBe(10); // 5m/s * 2s
    expect(shuttle?.isReturned).toBe(false);
    expect(shuttle?.speed).toBe(5);
    expect(shuttle?.load.length).toBe(0);
    expect(shuttle?.syncedAt).toBe(2000);

    game.run(4000); // Advanced to 20th second

    expect(shuttle?.position).toBe(20); // 5m/s * 2s
    expect(shuttle?.isReturned).toBe(true);
    expect(shuttle?.load).toHaveLength(1);
    expect(shuttle?.load[0].id).toBe('1');
    expect(shuttle?.load[0].amount).toBe(5n);
    expect(shuttle?.syncedAt).toBe(4000);
    expect(deposit?.oreStorages[0].amount).toBe(15);

    game.run(6000); // Advanced to 20th second

    expect(shuttle?.position).toBe(10); // 5m/s * 2s
    expect(shuttle?.isReturned).toBe(true);
    expect(shuttle?.load).toHaveLength(1);
    expect(shuttle?.load[0].id).toBe('1');
    expect(shuttle?.load[0].amount).toBe(5n);
    expect(shuttle?.syncedAt).toBe(6000);

    game.run(8000); // Advanced to 20th second

    const resource = wService.Resource('1');

    expect(shuttle?.position).toBe(0); // 5m/s * 2s
    expect(shuttle?.isReturned).toBe(false);
    expect(shuttle?.load).toHaveLength(0);
    expect(shuttle?.syncedAt).toBe(8000);
    expect(resource?.base.id).toBe('1');
    expect(resource?.amount).toBe(5n);
  });

  test('run 2 shuttles', async () => {
    return
    const rawData: GameData = {
      planet: {
        id: 'planet-1',
        name: 'Planet 1',
        money: '0',
        uid: '123',
        startedAt: 0,
        updatedAt: ''
      },
      deposits: [
        {
          pid: 'planet-1',
          sdid: '82',
          ores: [],
          rate: 5,
          syncedAt: 0,
        },{
          pid: 'planet-1',
          sdid: '83',
          ores: [],
          rate: 10,
          syncedAt: 0,
        }
      ],
      shuttles: [
        {
          pid: 'planet-1',
          ssid: '122',
          sdid: '82',
          power: 5,
          capacity: 5,
          position: {x: 0, y: 0},
          isReturned: false,
          load: [],
          syncedAt: 0,
        },{
          pid: 'planet-1',
          ssid: '122',
          sdid: '83',
          power: 5,
          capacity: 5,
          position: {x: 0, y: 0},
          isReturned: false,
          load: [],
          syncedAt: 0,
        }
      ],
      resources: [],
      machines: [],
      recipes: []
    }
    game.load(rawData);
    game.run(10_000); // Advanced to 10 seconds 

    expect(mService.Deposits()).toHaveLength(2);

    const deposit = mService.Deposit('82');
    expect(deposit).toBeTruthy();
    expect(deposit?.planetId).toBe('planet-1');
    expect(deposit?.base.id).toBe('82');
    expect(deposit?.rate).toBe(5);
    expect(deposit?.syncedAt).toBe(10000); // Update to time at run
    expect(deposit?.oreStorages.length).toBe(1);
    expect(deposit?.oreStorages[0].id).toBe('1');
    expect(deposit?.oreStorages[0].amount).toBe(50);

    const deposit2 = mService.Deposit('83');
    expect(deposit2).toBeTruthy();
    expect(deposit2?.planetId).toBe('planet-1');
    expect(deposit2?.base.id).toBe('83');
    expect(deposit2?.rate).toBe(10);
    expect(deposit2?.syncedAt).toBe(10000); // Update to time at run
    expect(deposit2?.oreStorages.length).toBe(2);
    expect(deposit2?.oreStorages[0].id).toBe('1');
    expect(deposit2?.oreStorages[0].amount).toBe(80);
    expect(deposit2?.oreStorages[1].id).toBe('2');
    expect(deposit2?.oreStorages[1].amount).toBe(20);
  });
})
