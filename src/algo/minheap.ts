export class MinHeap<T> {
  private heap: T[]
	constructor(private isLessThan: (o1: T, o2: T) => boolean) {
		this.heap = [];
	}

	// Helper Methods
	private getLeftChildIndex(parentIndex: number) {
		return 2 * parentIndex + 1;
	}
	private getRightChildIndex(parentIndex: number) {
		return 2 * parentIndex + 2;
	}
	private getParentIndex(childIndex: number) {
		return Math.floor((childIndex - 1) / 2);
	}
	private hasLeftChild(index: number) {
		return this.getLeftChildIndex(index) < this.heap.length;
	}
	private hasRightChild(index: number) {
		return this.getRightChildIndex(index) < this.heap.length;
	}
	private hasParent(index: number) {
		return this.getParentIndex(index) >= 0;
	}
	private leftChild(index: number) {
		return this.heap[this.getLeftChildIndex(index)];
	}
	private rightChild(index: number) {
		return this.heap[this.getRightChildIndex(index)];
	}
	private parent(index: number) {
		return this.heap[this.getParentIndex(index)];
	}

	// Functions to create Min Heap
	
	private swap(indexOne: number, indexTwo: number) {
		const temp = this.heap[indexOne];
		this.heap[indexOne] = this.heap[indexTwo];
		this.heap[indexTwo] = temp;
	}

	peek() {
		if (this.heap.length === 0) {
			return null;
		}
		return this.heap[0];
	}
	
	// Removing an element will remove the
	// top element with highest priority then
	// heapifyDown will be called
	remove(): T | null {
		if (this.heap.length === 0) {
			return null;
		}
		const item = this.heap[0];
		this.heap[0] = this.heap[this.heap.length - 1];
		this.heap.pop();
		this.heapifyDown();
		return item;
	}

	add(item: T) {
		this.heap.push(item);
		this.heapifyUp();
	}

	private heapifyUp() {
		let index = this.heap.length - 1;
		while (this.hasParent(index) && this.isLessThan(this.heap[index], this.parent(index))) {
			this.swap(this.getParentIndex(index), index);
			index = this.getParentIndex(index);
		}
	}

	private heapifyDown() {
		let index = 0;
		while (this.hasLeftChild(index)) {
			let smallerChildIndex = this.getLeftChildIndex(index);
			if (this.hasRightChild(index) && this.isLessThan(this.rightChild(index), this.leftChild(index))) {
				smallerChildIndex = this.getRightChildIndex(index);
			}
			if (this.isLessThan(this.heap[index], this.heap[smallerChildIndex])) {
				break;
			} else {
				this.swap(index, smallerChildIndex);
			}
			index = smallerChildIndex;
		}
	}
}

// // Creating the Heap
// var heap = new MinHeap();

// // Adding The Elements
// heap.add(10);
// heap.add(15);
// heap.add(30);
// heap.add(40);
// heap.add(50);
// heap.add(100);
// heap.add(40);

// // Printing the Heap
// heap.printHeap();

// // Peeking And Removing Top Element
// console.log(heap.peek());
// console.log(heap.remove());

// // Printing the Heap
// // After Deletion.
// heap.printHeap();
