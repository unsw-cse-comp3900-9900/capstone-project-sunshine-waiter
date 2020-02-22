import React from "react";
import { Link } from "react-router-dom";

export default class DevNav extends React.Component {
  state = {
    activeItem: "Resturant",
    mode: "development"
  };

  handleItemClick = e => {
    this.setState({ activeItem: e.target.name });
  };

  render() {
    const { activeItem } = this.state;

    return (
      <div className="ui five pointing item menu">
        {/* <Link className="active item">Customer</Link> */}
        <Link
          to="/"
          name="Resturant"
          onClick={this.handleItemClick}
          className={activeItem === "Resturant" ? "active item" : "item"}
        >
          Resturant
        </Link>
        <Link
          to="/customer"
          name="customer"
          onClick={this.handleItemClick}
          className={activeItem === "customer" ? "active item" : "item"}
        >
          Customer
        </Link>
        <Link
          to="/waiter"
          name="waiter"
          onClick={this.handleItemClick}
          className={activeItem === "waiter" ? "active item" : "item"}
        >
          Waiter
        </Link>
        <Link
          to="/kitchen"
          name="kitchen"
          onClick={this.handleItemClick}
          className={activeItem === "kitchen" ? "active item" : "item"}
        >
          Kitchen
        </Link>
        <Link
          to="/manager"
          name="manager"
          onClick={this.handleItemClick}
          className={activeItem === "manager" ? "active item" : "item"}
        >
          Manager
        </Link>
      </div>
    );
  }
}
