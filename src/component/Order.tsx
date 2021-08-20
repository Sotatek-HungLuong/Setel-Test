import React, { ChangeEvent, Component, ReactHTMLElement } from 'react';
import ProductLists from "./ProductList"
import "./index.css"
import axios from 'axios';


interface IProduct {
  name: string,
  description: string,
  price: number,
  vol: number
}

interface IOrder {
  id: number;
  time?: Date;
  status?: String;
  ownerId?: Number;
  Products?: IProduct[]
}
interface IOrderList {
  listOrder: IOrder[];
  orderChose?: IProduct[];
  openDialog?: boolean;
}
interface Props {

}


export default class Order extends React.Component<Props, IOrderList> {
  constructor(props: Props) {
    super(props);
    this.state = {
      listOrder: [],
      orderChose: [],
      openDialog: false,
    }
    this.handleCancelOrder = this.handleCancelOrder.bind(this);
    this.handleShowOrder = this.handleShowOrder.bind(this);
  }


  async componentDidMount() {
    fetch("http://localhost:7000/api/Orders").then(res => res.json().then(res => {
      let newListOrder = res;
      console.log(newListOrder.length);
      this.setState({ listOrder: newListOrder })
    })).catch(e => {
      console.log(e)
    })

    // axios.post("http://localhost:7000/api/Orders", {
    //   status: 1,
    //   id: 1
    // }).then(resposne => resposne.json()).then(res => {
    //   console.log(res)
    // }).catch(e => {
    //   console.log(e)
    // })
  }

  handleCancelOrder = (id: number) => {
    axios.post("http://localhost:7000/api/Order/updateStatus", { id: id, status: "Canceled"})
    .then(res => {
      alert("Canceled");
      let newListOrder = this.state.listOrder;
      newListOrder[id].status = "Canceled";
      this.setState({
        listOrder : newListOrder 
      })
    }).catch(e => console.log(e))
  }
 
  handleShowOrder = (id: number) => {
    this.setState({ orderChose: this.state.listOrder[id].Products });
    this.setState({ openDialog: true })
  }
  render() {
    return (
      <>
        <table className="table">
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Time</th>
            <th></th>
            <th></th>
          </tr>
          {this.state.listOrder.length !== 0 && this.state.listOrder.map((item: IOrder, index) => (
            <tr key={index} >
              <td>{index}</td>
              <td>{item.status}</td>
              <td>{item.time}</td>

              <td>
                <button onClick={() => { this.handleCancelOrder(index) }}>
                  Cancel
                </button>
              </td>
              <td>
                <button onClick={() => { this.handleShowOrder(index) }}>
                  Detail Product
                </button>
              </td>
            </tr>
          ))}
        </table>

        <div className="dialog" style={{ display: `${this.state.openDialog ? "" : "none"}` }}>
          <button onClick={() => {
            this.setState({
              openDialog: false
            })
          }} className="btn" style={{ position: "absolute", right: "0" }}><i className="fa fa-close"></i></button>
          <ProductLists products={this.state.orderChose} />
        </div>
      </>
    )
  }
}
