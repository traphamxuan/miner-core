// import { MinHeap } from './minheap'

// const lt = (n1: number, n2: number) => n1 < n2

// describe('Min Heap', () => {
//   it('add 1..10000 return 1..10000', () => {
//     const mheap = new MinHeap<number>(lt)
// 		const input = new Array(10000).fill(1).map((_, id) => id + 1)

// 		input.forEach(val => mheap.add(val))
		
// 		const result: number[] = []

// 		input.forEach(_ => result.push(mheap.remove()))

// 		expect(result).toHaveLength(10000)
// 		input.forEach((_, id) => expect(result[id]).toBe(id + 1))
//   });

// 	it('add 10000..1 return 10000..1', () => {
//     const mheap = new MinHeap<number>(lt)
// 		const input = new Array(10000).fill(1).map((_, id) => 10000 - id)

// 		input.forEach(val => mheap.add(val))
		
// 		const result: number[] = []

// 		input.forEach(_ => result.push(mheap.remove()))

// 		expect(result).toHaveLength(10000)
// 		input.forEach((_, id) => expect(result[id]).toBe(id + 1))
//   });

// 	it('add 10000, 1, 9999, 2..5001,5000 return 10000..1', () => {
//     const mheap = new MinHeap<number>(lt)
// 		const input = new Array(5000).fill(1).flatMap((_, id) => [10000 - id, id + 1])
// 		console.log(input)
// 		input.forEach(val => mheap.add(val))
		
// 		const result: number[] = []

// 		input.forEach(_ => result.push(mheap.remove()))
// 		console.log(result)
// 		expect(result).toHaveLength(10000)
// 		input.forEach((_, id) => expect(result[id]).toBe(id + 1))
//   });

// 	it('add 10000..1 return 10000..1, null', () => {
//     const mheap = new MinHeap<number>(lt)
// 		const input = new Array(10000).fill(1).map((_, id) => 10000 - id)

// 		input.forEach(val => mheap.add(val))
		
// 		const result: (number | null)[] = []

// 		input.forEach(_ => result.push(mheap.remove()))
// 		result.push(mheap.remove())

// 		expect(result).toHaveLength(10001)
// 		input.forEach((_, id) => expect(result[id]).toBe(id + 1))
// 		expect(result[result.length - 1]).toBeNull()
//   });

// });
