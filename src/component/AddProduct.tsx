import React, { ChangeEvent, Component, ReactHTMLElement } from 'react';
import ProductLists from "./ProductList"
import "./index.css"
import axios from 'axios';
import { randomInt } from 'crypto';
import { Redirect } from 'react-router-dom';
interface Product {
  name: string,
  description: string,
  price: number,
  vol: number
}
interface Order extends Product {
  products: Product[];
  sum: number;
  len: number;
  openDialog?: boolean;
}

interface Props {
}

let ProductList = [{ name: "Doping", description: "Nothing is impossible", price: 1000 }
  , { name: "Weed", description: "It's time to get high", price: 1500 }
  , { name: "Drug", description: "I can fly", price: 500 }
  , { name: "Beer", description: "Only for man", price: 20} 
  , { name: "Shisha", description: "India journey", price: 100}];


export default class AddProduct extends React.Component<Props, Order> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      price: 0,
      vol: 0,
      products: [],
      sum: 0,
      len: 0,
      openDialog: false,
    }
    this.handleOnChangeTextForm = this.handleOnChangeTextForm.bind(this);
    this.handleOnChangeSelectForm = this.handleOnChangeSelectForm.bind(this);
    this.handleOnClickAddProduct = this.handleOnClickAddProduct.bind(this);
    this.handleCallbackDeleteProduct = this.handleCallbackDeleteProduct.bind(this);
    this.handleToOpenPay = this.handleToOpenPay.bind(this);
  }
  async componentDidMount() {
    console.log("ok");
    fetch("http://localhost:7000/api/Orders").then(res => res.json().then(res => {
      let newListOrder = res
      console.log(newListOrder.length)
      this.setState({ len: newListOrder.length })
    })).catch(e => {
      // console.log(e)
    })
  }

  handleOnChangeTextForm(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    this.setState({ vol: Number(e.target.value) })
  }

  handleOnChangeSelectForm(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    let idProduct = Number(e.target.value);
    if (idProduct === -1) {
      this.setState({name: "", description: "", price: 0})
      return
    };
    this.setState({ name: ProductList[idProduct].name })
    this.setState({ description: ProductList[idProduct].description })
    this.setState({ price: ProductList[idProduct].price })
  }

  handleOnClickAddProduct(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    let newProducts = this.state.products;
    let newProduct = {
      name: this.state.name,
      description: this.state.description,
      price: this.state.price,
      vol: this.state.vol
    };
    let newSum = this.state.sum + (newProduct.price * newProduct.vol)
    this.setState({ sum: newSum })
    let ok = 0;
    for (let i = 0; i < newProducts.length; i++) {
      if (newProducts[i].name == newProduct.name) {
        ok = 1;
        let newVol = newProducts[i].vol + newProduct.vol;
        newProducts[i].vol = newVol;
      }
    }
    if (ok == 0) newProducts.push(newProduct);
    this.setState({ products: newProducts });
  }
  handleCallbackDeleteProduct(id: number) {
    console.log(this.state.products)
    let productsCache = this.state.products;
    console.log(productsCache)
    productsCache.splice(id, 1);
    console.log(productsCache)
    this.setState({
      products: productsCache
    })
  }
  handleAddOrder = () => {
    axios.post("http://localhost:7000/api/AddOrder", { id: this.state.len, time: new Date, status: "Created", ownerId: 1, Products: this.state.products })
      .then(res => {
        let newLen = this.state.len + 1;
        this.setState({ len: newLen });
        console.log(res);
        this.handleToOpenPay();
      }).catch(e => console.log(e))
  }
  handleToOpenPay = () => {
    this.setState({ openDialog: true })
  }
  handleToPay = () => {
    let rand = Math.random() + Math.random();
    let statusChange:String;
    if (rand <= 1) {
      statusChange = "Canceled";
    } else {
      statusChange = "Confirmed"
    }
    console.log(this.state.len - 1);
    axios.post("http://localhost:7000/api/Order/updateStatus", { id: this.state.len - 1, status: statusChange})
    .then(res => {
      alert(statusChange);
      if (statusChange === "Confirmed") {
        setTimeout(this.handleToDelivered, 10000);
      }
      this.setState({
        openDialog: false
      })
    }).catch(e => console.log(e))
  }
  handleToDelivered = () => {
    let statusChange = "Delivered";
    axios.post("http://localhost:7000/api/Order/updateStatus", { id: this.state.len - 1, status: statusChange})
    .then(res => {
      alert(statusChange);
    }).catch(e => console.log(e))
  }

  render() {
    return (
      <div className="root">
        <select className="custom-select custom-select-lg mb-3" placeholder="select options" aria-label="Default select example" name="idProduct" onChange={this.handleOnChangeSelectForm} >
          <option value="-1">-----------------------------------Select Product-----------------------------------</option>
          <option value="0">Doping</option>
          <option value="1">Weed</option>
          <option value="2">Drug</option>
          <option value="3">Beer</option>
          <option value="4">Shisha</option>
        </select>
        <div className="form-group">
          <label className="control-label" htmlFor="description">Description:</label>
          <input type="text" className="form-control" id="description" name="description" placeholder="Description" value={this.state.description} disabled />
        </div>
        <div className="form-group">
          <label className="control-label" htmlFor="price">Price:</label>
          <input type="text" className="form-control" id="price" name="price" placeholder="Price" value={String(this.state.price)} disabled />
        </div>
        <div className="form-group">
          <label className="control-label" htmlFor="vol">Volume:</label>
          <input type="number" className="form-control" id="vol" name="vol" placeholder="Volume" onChange={this.handleOnChangeTextForm} />
        </div>
        <div className="form-group">
          <button className="btn btn-primary" type='submit' onClick={this.handleOnClickAddProduct}>Add Product</button>
        </div>
        <div>
          <ProductLists products={this.state.products} sum={this.state.sum} onDelete={this.handleCallbackDeleteProduct} />
        </div>
        <div>
          <div className="form-group">
            <button className="btn btn-primary" type='submit' onClick={this.handleAddOrder}>Add Order</button>
          </div>
        </div>
        <div className="dialog" style={{ display: `${this.state.openDialog ? "" : "none"}` }}>
          <button onClick={() => {
            this.setState({
              openDialog: false
            })
          }} className="btn btn-danger" style={{ position: "absolute", right: "0" }}>&times;</button>
          <select className="custom-select custom-select-lg mb-3" placeholder="select options" aria-label="Default select example">
            <option value="-1">Select How to Pay your Order</option>
            <option value="0">Visa</option>
            <option value="1">Paypal</option>
            <option value="2">MasterCard</option>
          </select>
          <div className="form-group">
            <button className="btn btn-success" type='submit' onClick={this.handleToPay}>Pay Order</button>
            <button type="button" className="btn btn-danger" onClick={() => {
            this.setState({
              openDialog: false
            })
          }}>Close</button>
          </div>
        </div>
      </div>
    )
  }
}
