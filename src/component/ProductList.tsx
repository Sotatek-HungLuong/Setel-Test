import React from "react";

interface Product {
  name: string,
  description: string,
  price: number,
  vol: number
}
interface Order {
  products: Product[];
}

interface Props {
  products: Product[] | undefined;
  sum?: number
  onDelete?: (id: number) => void;
}

export default class ProductList extends React.Component<Props, Order> {
  constructor(props: Props) {
    super(props);
    this.state = {
      products: [],
    }
  }

  onDeleteProduct(id: number) {
    this.props.onDelete && this.props.onDelete(id)
  }
  componentDidMount() {
    console.log(this.props)
  }
  render() {
    return (
      <table className = "w3-table w3-bordered table w3-striped">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Volume</th>
          <th>Money</th>
        </tr>
        {this.props.products &&
          this.props.products.map((prod, index) => {
            let money = prod.vol * prod.price;
            return (
              <tr key={index}>
                <td>{prod.name}</td>
                <td>{prod.description}</td>
                <td>{prod.price}</td>
                <td>{prod.vol}</td>
                <td>{money}</td>
                <span className="pull-right text-uppercase delete-button" onClick={() => { this.onDeleteProduct(index) }}>&times;</span>
              </tr>
            )
          })
        }
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <th>Payment Money</th>
          <td>{this.props.sum}</td>
        </tr>
      </table>
    )
  }
}