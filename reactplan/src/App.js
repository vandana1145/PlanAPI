import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Plan from "./Plan";
import axios from "axios";

import React, { Component } from "react";

//create Axios Instance
const ai = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export class App extends Component {
  state = {
    items: [],
    text: "",
  };

  showPlan = () => {
    ai.get("/api/list/")
      .then((response) => {
        console.log(response.data);
        this.setState({ items: response.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  addPlan = (d) => {
    if (this.state.text !== "") {
      ai.post("/api/create/", d)
        .then((response) => {
          console.log(response.data);
          this.setState({ text: "" });
          this.showPlan();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  handleChange = (e) => {
    this.setState({ text: e.target.value });
  };

  handleAdd = (e) => {
    let dt = { item: this.state.text };
    this.addPlan(dt);
    // if (this.state.text !== ''){
    //   const items = [...this.state.items, this.state.text];
    //   console.log(items)
    //   this.setState({items: items, text: ''});
    // }
  };

  handleDelete = (id) => {
    console.log("Deleted", id);
    ai.delete(`/api/delete/${id}`)
      .then((response) => {
        this.showPlan();
      })
      .catch((err) => {
        console.log(err);
      });
    // const oldItems = [...this.state.items];
    // console.log("OldItems", oldItems);
    // const newItems = oldItems.filter((element, i) => {
    //   return i !== id;
    // });
    // console.log("NewItems", newItems);
    // this.setState({ items: newItems });
  };

  componentDidMount() {
    this.showPlan();
  }

  render() {
    return (
      <div className="container-fluid my-5">
        <div className="row">
          <div className="col-sm-6 mx-auto text-white shadow-lg p-3">
            <h1 className="text-center">To-Do Plan List</h1>
            <div className="row">
              <div className="col-9">
                <input
                  type="text"
                  className="form-control"
                  placeholder="What's your plan"
                  value={this.state.text}
                  onChange={this.handleChange}
                />
              </div>
              <div className="col-2">
                <button
                  className="btn btn-warning px-5 font-weight-bold"
                  onClick={this.handleAdd}
                >
                  Add
                </button>
              </div>
              <div className="container-fluid">
                <ul className="list-unstyled row m-5">
                  {console.log("State Items", this.state.items)}
                  {this.state.items.map((value, i) => {
                    console.log(value.id, value.item);
                    return (
                      <Plan
                        key={i}
                        value={value.item}
                        id={value.id}
                        sendData={this.handleDelete}
                      />
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
