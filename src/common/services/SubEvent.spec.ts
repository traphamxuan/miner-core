// import { describe, expect, test } from 'vitest'

// import { SubEvent } from "./SubEvent";

// type callback = {
//   onCheck1?: (id: string, res: number) => void
//   onCheck2?: (id: string, res: number) => void
// }

// describe('SubEvent', () => {
//   test('count 1000 for dispatch 1000 on checker 1', () => {
//     const testId = '1'
//     const subEvent = new SubEvent<callback>()

//     const testCheck1: {id: string, result: number}[] = []

//     subEvent.registerChange(testId, 'Test1', { onCheck1: (id, result) => testCheck1.push({ id, result }) })

//     const testerArray = new Array(1000).fill(0)
//     testerArray.forEach(id => {
//       subEvent.dispatchEvent(testId, 'onCheck1', id)
//     })

//     expect(subEvent).toBeDefined();
//     expect(testCheck1).toHaveLength(1000)
//     testCheck1.forEach(res => {
//       expect(res.id).toBe(testId)
//       expect(res.result).toBe(0)
//     })
//   });

//   test('count 1000 for dispatch 1000 on 2 checkers', () => {
//     const testId = '2'
//     const subEvent = new SubEvent<callback>()

//     const testCheck1: {id: string, result: number}[] = []
//     const testCheck2: {id: string, result: number}[] = []


//     subEvent.registerChange(testId, 'test1', { onCheck1: (id, result) => testCheck1.push({ id, result }) })
//     subEvent.registerChange(testId, 'test2', { onCheck2: (id, result) => testCheck2.push({ id, result }) })

//     const testerArray = new Array(1000).fill(0)
//     testerArray.forEach(id => {
//       subEvent.dispatchEvent(testId, 'onCheck1', id)
//     })

//     expect(subEvent).toBeDefined();
//     expect(testCheck1).toHaveLength(1000)
//     testCheck1.forEach(res => {
//       expect(res.id).toBe(testId)
//       expect(res.result).toBe(0)
//     })
//     expect(testCheck2).toHaveLength(0)

//     testerArray.forEach(id => {
//       subEvent.dispatchEvent(testId, 'onCheck2', id)
//     })

//     expect(testCheck1).toHaveLength(1000)
//     testCheck1.forEach(res => {
//       expect(res.id).toBe(testId)
//       expect(res.result).toBe(0)
//     })
//     expect(testCheck2).toHaveLength(1000)
//     testCheck2.forEach(res => {
//       expect(res.id).toBe(testId)
//       expect(res.result).toBe(0)
//     })
//   });


//   test('count 1000 for dispatch 1000 on 1st checkers and 0 in second when unregister', () => {
//     const testId = '2'
//     const subEvent = new SubEvent<callback>()

//     const testCheck1: {id: string, result: number}[] = []
//     const testCheck2: {id: string, result: number}[] = []


//     subEvent.registerChange(testId, 'test1', { onCheck1: (id, result) => testCheck1.push({ id, result }) })
//     subEvent.registerChange(testId, 'test2', { onCheck2: (id, result) => testCheck2.push({ id, result }) })

//     const testerArray = new Array(1000).fill(0)
//     testerArray.forEach(id => {
//       subEvent.dispatchEvent(testId, 'onCheck1', id)
//     })

//     expect(subEvent).toBeDefined();
//     expect(testCheck1).toHaveLength(1000)
//     testCheck1.forEach(res => {
//       expect(res.id).toBe(testId)
//       expect(res.result).toBe(0)
//     })
//     expect(testCheck2).toHaveLength(0)

//     subEvent.unregisterChange(testId, 'test2')

//     testerArray.forEach(id => {
//       subEvent.dispatchEvent(testId, 'onCheck2', id)
//     })

//     expect(subEvent).toBeDefined();
//     expect(testCheck1).toHaveLength(1000)
//     testCheck1.forEach(res => {
//       expect(res.id).toBe(testId)
//       expect(res.result).toBe(0)
//     })
//     expect(testCheck2).toHaveLength(0)
//   });
// });
