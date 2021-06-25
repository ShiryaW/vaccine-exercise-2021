import "./App.css";
import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import { Dropdown } from "./Dropdown";
import { Footer } from "./Footer";

import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import BRANDS from "./util/constants";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowData: [],
      selectedManufacturer: BRANDS.ANTIQUA.value,
      totalItems: 0,
      isGroupingView: false,
    };

    this.gridOptions = {
      defaultColDef: { resizable: true },
      animateRows: true,
      columnDefs: this.getColumnDefs(),
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
          totalItems: data.length,
        });
      });
  };

  getColumnDefs = () => {
    return [
      {
        headerName: "ID",
        field: "id",
      },
      {
        headerName: "Order number",
        field: "orderNumber",
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: "Responsible person",
        field: "responsiblePerson",
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: "Healthcare district",
        field: "healthCareDistrict",
        ...(this.state.isGroupingView
          ? { rowGroup: true }
          : { rowGroup: false }),
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
        sortable: true,
        unSortIcon: true,
      },
    ];
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

  onToggle = () => {
    this.setState(
      {
        isGroupingView: !this.state.isGroupingView,
      },
      () => {
        this.gridApi.setColumnDefs(this.getColumnDefs());
      }
    );
  };

  render = () => {
    return (
      <div className="app">
        <Dropdown onChange={this.onSelectionChanged} onToggle={this.onToggle} />
        <div className="ag-theme-alpine">
          <AgGridReact
            gridOptions={this.gridOptions}
            rowData={this.state.rowData}
          />
        </div>
        <Footer totalItems={this.state.totalItems} />
      </div>
    );
  };
}

export default App;
