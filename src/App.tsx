import React from 'react';
import logo from './logo.svg';
import './App.css';
import AddProduct from './component/AddProduct';
import Order from "./component/Order"
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom"
let App: React.FC = () => {
  return (
    <div>
      <Router>
      <div className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to="/order">Order List </Link>
            <Link to="/add-product">Add Order</Link>
          </div>
        </div>
      </div>
        <Switch>
          <Route exact path="/add-product">
            <AddProduct />
          </Route>
          <Route exact path="/order">
            <Order />
          </Route>
        </Switch>
      </Router>

    </div>

  )
}

export default App;
