class HashTable {
  constructor() {
    this.table = new Array(127); // there are 127 ASCII sybmols
    this.size = 0;
  }

  _hash(key) {
    let hash = 0;
    key = key.toString();

    for (let i = 0; i < key.length; i++) {
      hash += key[i].charCodeAt();
    }

    return hash % this.table.length;
  }

  loadFactor() {
    return (this.size / this.table.length).toFixed(3);
  }

  display() {
    this.table.forEach((value, index) => {
      console.log(index, ":", value.length > 1 ? value : value[0]);
    });
  }

  insert(key, value) {
    const index = this._hash(key);

    if (this.table[index]) {
      for (let i = 0; i < this.table[index].length; i++) {
        if (this.table[index][i][0] === key) {
          this.table[index][i][1] = value;
          return;
        }
      }

      this.table[index].push([key, value]);
    } else {
      this.table[index] = [];
      this.table[index].push([key, value]);
    }

    this.size++;
  }

  retrieve(key) {
    const entry = this._hash(key);

    if (this.table[entry]) {
      for (let i = 0; i < this.table[entry].length; i++) {
        if (this.table[entry][i][0] === key) {
          return this.table[entry][i][1];
        }
      }
    }

    return undefined;
  }

  delete(key) {
    const index = this._hash(key);

    if (this.table[index] && this.table[index].length) {
      for (let i = 0; i < this.table[index].length; i++) {
        if (this.table[index][i][0] === key) {
          this.table[index].splice(i, 1);
          this.size--;
          return true;
        }
      }
    } else {
      return false;
    }
  }
}
