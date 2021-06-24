import "./App.css";
import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import { Dropdown } from "./Dropdown";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import BRANDS from "./util/constants";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowData: [],
      selectedManufacturer: BRANDS.ANTIQUA.value,
    };

    this.columnDefs = [
      {
        headerName: "ID",
        field: "id",
      },
      {
        headerName: "Order number",
        field: "orderNumber",
      },
      {
        headerName: "Responsible person",
        field: "responsiblePerson",
      },
      {
        headerName: "Healthcare district",
        field: "healthCareDistrict",
      },
      {
        headerName: "Vaccine",
        field: "vaccine",
      },
      {
        headerName: "Injections",
        field: "injections",
      },
      {
        headerName: "Arrived on",
        field: "arrived",
      },
    ];

    this.gridOptions = {
      defaultColDef: { resizable: true },
      columnDefs: this.columnDefs,
      onGridReady: this.onGridReady,
    };
  }

  componentDidMount = () => {
    window.addEventListener("resize", this.handleResize);
  };

  handleResize = () => {
    this.gridApi && this.gridApi.sizeColumnsToFit();
  };

  handleRowsFetch = async () => {
    await fetch(
      `/orders?brand=${encodeURIComponent(this.state.selectedManufacturer)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        this.setState({
          rowData: data,
        });
      });
  };

  onGridReady = async ({ api }) => {
    await this.handleRowsFetch(this.state.selectedManufacturer);
    this.gridApi = api;
    this.gridApi.sizeColumnsToFit();
  };

  onSelectionChanged = (e) => {
    this.setState(
      {
        selectedManufacturer: e.target.value,
      },
      async () => {
        await this.handleRowsFetch(this.state.selectedManufacturer);
      }
    );
  };

  render = () => {
    return (
      <div className="app">
        <Dropdown onChange={this.onSelectionChanged} />
        <div className="ag-theme-alpine">
          <AgGridReact
            gridOptions={this.gridOptions}
            rowData={this.state.rowData}
          />
        </div>
      </div>
    );
  };
}

export default App;
