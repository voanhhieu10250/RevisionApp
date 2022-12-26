class HashNode<K, V> {
  key: K;
  val: V;

  // Storing address of next HashNode
  next: HashNode<K, V> | null;

  constructor(key: K, val: V) {
    this.key = key;
    this.val = val;
    this.next = null;
  }

  public toString(): string {
    return this.key + " | " + this.val;
  }
}

class HashTable<K, V> {
  // chainArray is used to store array of chains
  private hashNodes: (HashNode<K, V> | null)[];

  // capacity of chainArray.
  private hashCapacity: number;

  // number of elements is being stored in this HashTable
  private _size: number;

  constructor(size = 293) {
    this.hashCapacity = size; // Default capacity will be 293
    this.hashNodes = new Array<HashNode<K, V>>(size);
    this._size = 0;

    // Create empty chains
    for (let i = 0; i < this.hashCapacity; i++) {
      this.hashNodes[i] = null;
    }
  }

  // Hash function - using Division method
  // Find index for a key
  private hash(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash % this.hashCapacity;
  }

  // If load factor goes beyond threshold, then
  // increase hash-table capacity
  private rehash(): void {
    let tempArray = this.hashNodes;

    // double the current capacity and find the next prime number
    this.hashCapacity = this.nextPrime(2 * this.hashCapacity);
    this.hashNodes = new Array<HashNode<K, V>>(this.hashCapacity);
    this._size = 0;

    // Create empty chains
    for (let i = 0; i < this.hashCapacity; i++) {
      this.hashNodes[i] = null;
    }

    // Copy the old hashNodes to the new hashNodes
    for (let n of tempArray) {
      // Loop through the curNode and add each curNode back to the curNode
      while (n !== null) {
        this.add(n.key, n.val);
        n = n.next;
      }
    }
  }

  // Function that returns true if n
  // is prime else returns false
  private isPrime(num: number): boolean {
    // Corner cases
    if (num <= 1) return false;
    if (num <= 3) return true;

    // This is checked so that we can skip
    // middle five numbers in below loop
    if (num % 2 == 0 || num % 3 == 0) return false;

    for (let i = 5; i * i <= num; i = i + 6)
      if (num % i == 0 || num % (i + 2) == 0) return false;

    return true;
  }

  // Function to return the smallest
  // prime number greater than N
  private nextPrime(num: number): number {
    // Base case
    if (num <= 1) return 2;

    let prime = num;
    let found = false;

    // Loop continuously until isPrime returns
    // true for a number greater than n
    while (!found) {
      prime++;
      if (this.isPrime(prime)) found = true;
    }

    return prime;
  }

  public isEmpty(): boolean {
    return this._size == 0;
  }

  get size(): number {
    return this._size;
  }

  public capacity() {
    return this.hashCapacity;
  }

  // Adds a key-value pair to hash table
  public add(key: K, value: V): void {
    let chainIndex = this.hash(
      typeof key === "object" ? JSON.stringify(key) : new Object(key).toString()
    ); // Pass key to Hash Function

    // Get the Chain in HashTable with appropriate index
    let curNode: HashNode<K, V> | null = this.hashNodes[chainIndex];

    // Check if key is already exist in this chain.
    // If exists then update the value and end this method.
    while (curNode !== null) {
      if (curNode.key === key) {
        curNode.val = value;
        return;
      }
      curNode = curNode.next;
    }

    // The given key doesn't exist
    // => Add a new key-value pair (new Node)
    this._size++;
    curNode = this.hashNodes[chainIndex]; // get the head node in chain

    // Add a new HashNode to the top of the Chain (LinkedList)
    let newNode: HashNode<K, V> = new HashNode(key, value);
    newNode.next = curNode;
    this.hashNodes[chainIndex] = newNode;

    // If load factor goes beyond threshold, then increase hash table size
    if (this._size / this.hashCapacity >= 0.7) {
      this.rehash();
    }
  }

  // Return value of the element if success.
  // Return null if key is not found.
  public remove(key: K): V | undefined {
    let chainIndex = this.hash(
      typeof key === "object" ? JSON.stringify(key) : new Object(key).toString()
    ); // Pass key to Hash Function

    // Get the Chain in HashTable with appropriate index
    let curNode: HashNode<K, V> | null = this.hashNodes[chainIndex];
    let prev: HashNode<K, V> | null = null;

    // Search for Node with the given key
    while (curNode != null) {
      // If Key found
      if (curNode.key === key) {
        break;
      }
      prev = curNode;
      curNode = curNode.next;
    }

    // If key is not exist
    if (curNode == null) {
      return;
    }

    // Reduce size
    this._size--;

    // Remove element
    if (prev != null) {
      prev.next = curNode.next;
    } else {
      // if curNode is the curNode curNode of curNode
      this.hashNodes[chainIndex] = curNode.next;
    }

    return curNode.val;
  }

  // Returns value for a key
  public get(key: K): V | undefined {
    let bucketIndex = this.hash(
      typeof key === "object" ? JSON.stringify(key) : new Object(key).toString()
    );

    // Get the Chain in HashTable with appropriate index
    let curNode: HashNode<K, V> | null = this.hashNodes[bucketIndex];

    // Search key in curNode
    while (curNode != null) {
      if (curNode.key === key) {
        return curNode.val;
      }
      curNode = curNode.next;
    }

    // If key not found
    return;
  }

  // Print all elements in Hash Table to console
  public printAll(): void {
    for (let curNode of this.hashNodes) {
      while (curNode != null) {
        console.log(curNode.key + " = " + curNode.val);
        curNode = curNode.next;
      }
    }
  }

  // convert hash table to array
  public toArray(
    startIndex?: number,
    elementAmount?: number
  ): { key: K; value: V }[] {
    let list: { key: K; value: V }[] = [];
    let idxCounter = 0;

    if (elementAmount) {
      if (elementAmount > this._size) elementAmount = this._size;

      for (let curNode of this.hashNodes) {
        if (list.length >= elementAmount) break;

        while (curNode != null && list.length < elementAmount) {
          if (startIndex) {
            if (idxCounter < startIndex) {
              curNode = curNode.next;
              idxCounter++;
              continue;
            }
            list.push({ key: curNode.key, value: curNode.val });
            curNode = curNode.next;
            idxCounter++;
          } else {
            list.push({ key: curNode.key, value: curNode.val });
            curNode = curNode.next;
          }
        }
      }
    } else {
      for (let curNode of this.hashNodes) {
        while (curNode != null) {
          if (startIndex) {
            if (idxCounter < startIndex) {
              curNode = curNode.next;
              idxCounter++;
              continue;
            }
            list.push({ key: curNode.key, value: curNode.val });
            curNode = curNode.next;
            idxCounter++;
          } else {
            list.push({ key: curNode.key, value: curNode.val });
            curNode = curNode.next;
          }
        }
      }
    }
    return list;
  }

  public getChain(index: number): HashNode<K, V> | null {
    if (index >= this.hashCapacity || index < 0) {
      return null;
    }

    let result = this.hashNodes[index];
    return result;
  }

  // get the index of the chain that has the most elements
  public hashTableInfo(): {
    indexLongest: number;
    lengthLongest: number;
    numOfNullBuckets: number;
  } {
    let idxLongest = -1;
    let lengthLongest = 0;
    let numOfNullBuckets = 0;

    for (let i = 0; i < this.hashCapacity; i++) {
      if (this.hashNodes[i] != null) {
        let curNode = this.hashNodes[i];
        let countEle = 0;

        while (curNode != null) {
          countEle++;
          curNode = curNode.next;
        }

        if (countEle > lengthLongest) {
          lengthLongest = countEle;
          idxLongest = i;
        }
      } else {
        // If chain (LinkedList) is null
        numOfNullBuckets++;
      }
    }

    return {
      indexLongest: idxLongest,
      lengthLongest: lengthLongest,
      numOfNullBuckets: numOfNullBuckets,
    };
  }
}

export default HashTable;
