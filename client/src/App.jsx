import "./App.css";
import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import { Dropdown } from "./Dropdown";
import { Footer } from "./Footer";

import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import VIEWS from "./util/constants";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowData: [],
      selectedView: VIEWS.ANTIQUA.value,
      totalItems: 0,
      isGroupingView: false,
      groupingEnabled: true,
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
    if (this.state.selectedView === VIEWS.VACCINATIONS.value) {
      await this.fetchVaccinations();
    } else {
      await this.fetchManufacturer();
    }
  };

  fetchVaccinations = async () => {
    await fetch(`/vaccinations`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        this.setState(
          {
            rowData: data,
            totalItems: data.length,
            groupingEnabled: false,
          },
          () => {
            this.gridApi && this.gridApi.setColumnDefs(this.getColumnDefs());
            this.gridApi && this.gridApi.sizeColumnsToFit();
          }
        );
      });
  };

  fetchManufacturer = async () => {
    await fetch(
      `/orders?brand=${encodeURIComponent(this.state.selectedView)}`,
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
        this.setState(
          {
            rowData: data,
            totalItems: data.length,
            groupingEnabled: true,
          },
          () => {
            this.gridApi && this.gridApi.setColumnDefs(this.getColumnDefs());
            this.gridApi && this.gridApi.sizeColumnsToFit();
          }
        );
      });
  };

  getColumnDefs = () => {
    if (this.state.groupingEnabled) {
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
    } else {
      return [
        {
          headerName: "Vaccination ID",
          field: "vaccinationId",
        },
        {
          headerName: "Source bottle",
          field: "sourceBottle",
        },
        {
          headerName: "Gender",
          field: "gender",
          sortable: true,
          unSortIcon: true,
        },
        {
          headerName: "Vaccination date",
          field: "vaccinationDate",
        },
      ];
    }
  };

  onGridReady = async ({ api }) => {
    await this.handleRowsFetch(this.state.selectedView);
    this.gridApi = api;
    this.gridApi.sizeColumnsToFit();
  };

  onSelectionChanged = (e) => {
    this.setState(
      {
        selectedView: e.target.value,
      },
      async () => {
        await this.handleRowsFetch(this.state.selectedView);
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
        <Dropdown
          onChange={this.onSelectionChanged}
          onToggle={this.onToggle}
          groupingEnabled={this.state.groupingEnabled}
        />
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
