// models/Produto.js
class Produto {
  constructor({
    id = null,
    name,
    description = "",
    price = 0.0,
    stock = 0,
  } = {}) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._price = price;
    this._stock = stock;
  }

  // getters
  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get description() {
    return this._description;
  }
  get price() {
    return this._price;
  }
  get stock() {
    return this._stock;
  }

  // setters
  set id(v) {
    this._id = v;
  }
  set name(v) {
    this._name = v;
  }
  set description(v) {
    this._description = v;
  }
  set price(v) {
    this._price = v;
  }
  set stock(v) {
    this._stock = v;
  }
}

module.exports = Produto;
