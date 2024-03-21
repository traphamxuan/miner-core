import { Game } from "../src";

export function showMain(game: Game) {
  const resources = game.getService('warehouse').Resources()
  const shuttles = game.getService('miner').Shuttles()
  const machines = game.getService('factory').Machines()
  const planet = game.getService('planet').planet
  let presentator: string[][] = []

  let shuttleInfo = ''
  for (const shuttle of shuttles) {
    const shuttleLoad = shuttle.load.map(l => `${l.base.name}: ${numToStrDec(l.amount)}`).join(',')
    shuttleInfo += `${shuttle.base.id}\t${shuttle.base.name}\t${toTimeAmount(shuttle.syncedAt).timeString}\t${numToStrDec(shuttle.position)}\t${shuttleLoad}\n`
    if (shuttle.deposit) {
      const deposit = shuttle.deposit
      const depositOres = deposit.oreStorages.map(o => `${o.base.name}: ${numToStrDec(o.amount)}`).join(', ')
      shuttleInfo += `${deposit.base.id}\t${deposit.base.name}\t${toTimeAmount(deposit.syncedAt).timeString}\t${numToStrDec(deposit.rate)}\t${depositOres}\n`
    }
  }

  let resourcesInfo = ''
  let maxNameLength = 0
  for (const resource of resources) {
    if (maxNameLength < resource.base.name.length) {
      maxNameLength = resource.base.name.length
    }
    presentator.push([
      resource.base.id,
      resource.base.name,
      toTimeAmount(resource.syncedAt).timeString,
      numToStrDec(resource.amount),
      '$' + numToStrDec(resource.amount * resource.base.value)
    ])
  }
  resourcesInfo += presentator.map(([id, name, time, amount, value]) => `${id}\t${name.padEnd(maxNameLength, ' ')}\t${time}\t${amount}\t${value}`).join('\n')

  let machineInfo = ''
  for (const machine of machines) {
    machineInfo += `${machine.base.id}\t${machine.base.name}\t${toTimeAmount(machine.syncedAt).timeString}\t${machine.recipe?.base.target.name || ''}\t${toTimeAmount(machine.progress).timeString}\n`
  }

  const screen = `Welcome to ExoMiner in console version
Planet: ${planet?.name}\tMoney: ${planet?.money}
Miner:
${shuttleInfo}

Warehouse:
${resourcesInfo}

Factory:
${machineInfo}
----------------`
  console.log(screen)
}

export function registerContinuousShow(game: Game) {
  game.getRender('warehouse').register({ onSync: () => { } }, 'warehouse-rendering')
  game.getRender('factory').register({ onSync: () => { } }, 'factory-rendering')
  game.getRender('miner').register({ onSync: () => { } }, 'miner-rendering')
}

export function unregisterContinuousShow(game: Game): void {
  game.getRender('warehouse').unregister('warehouse-rendering')
  game.getRender('factory').unregister('factory-rendering')
  game.getRender('miner').unregister('miner-rendering')
}

export const toTimeAmount = (timestamp: number): {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  millisecond: number
  timeString: string
} => {
  let timeString = ''
  const year = Math.floor(timestamp / 31_536_000_000)
  timeString += year ? `${year}y` : ''
  timestamp %= 31_536_000_000
  const month = Math.floor(timestamp / 2_592_000_000)
  timeString += month ? `${month}M` : ''
  timestamp %= 2_592_000_000
  const day = Math.floor(timestamp / 86_400_000)
  timeString += day ? `${day}D` : ''
  timestamp %= 86_400_000
  const hour = Math.floor(timestamp / 3_600_000)
  timeString += hour ? `${timeString ? ' ' : ''}${hour}h` : ''
  timestamp %= 3_600_000
  const minute = Math.floor(timestamp / 60_000)
  timeString += minute ? `${minute}m` : ''
  timestamp %= 60_000
  const second = Math.floor(timestamp / 1000)
  timeString += second ? `${second}s` : ''
  timestamp %= 1000
  const millisecond = timestamp
  timeString += millisecond ? `${numToStrDec(millisecond)}ms` : ''
  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    timeString,
  }
}

const POSTFIX = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'R', 'Q']

const toString = (num: number, decimal: number): string => {
  const numStr = num.toString()
  const dotIndex = numStr.indexOf('.')
  if (dotIndex === -1) {
    return numStr
  }
  return numStr.slice(0, dotIndex + (decimal ? (decimal + 1) : 0))
}

function decimalToStrDec(num: number, dec = 0) {
  if (num < 1) {
    return toString(num, 3)
  } else if (num < 10) {
    return toString(num, 2)
  } else if (num < 100) {
    return toString(num, 1)
  } else if (num < 1000) {
    return toString(num, 0)
  }
  for (; num >= 1_000 && dec < POSTFIX.length - 1; num /= 1000, dec++);
  return `${toString(num, 2)}${POSTFIX[dec]}`
}

function bigIntToStrDec(num: bigint, dec = 0) {
  for (; num >= 1_000_000_000_000n && dec < POSTFIX.length - 1; num /= 1000n, dec++);
  if (dec == POSTFIX.length - 1) {
    return num.toString() + POSTFIX[dec]
  }
  return decimalToStrDec(Number(num), dec)
}

function strToStrDec(num: string, dec = 0) {
  const [int] = num.split('.')
  if (int.length > 15) {
    return bigIntToStrDec(BigInt(int), dec)
  }
  return decimalToStrDec(Number(num), dec)
}

function numToStrDec(num: number | bigint | string): string {
  switch (typeof num) {
    case 'bigint':
      return bigIntToStrDec(num)
    case 'number':
      return decimalToStrDec(num)
    case 'string':
      return strToStrDec(num)
  }
}
