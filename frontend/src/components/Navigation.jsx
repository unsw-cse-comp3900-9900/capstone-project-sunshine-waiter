import React from "react";
import { Link } from "react-router-dom";

export default class Navigation extends React.Component {
  state = {
    activeItem: "",
    mode: "development"
  };

  handleItemClick = e => {
    this.setState({ activeItem: e.target.name });
  };

  render() {
    const { activeItem } = this.state;

    return (
      <div className="ui three pointing item menu">
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
