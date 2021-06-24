import "./App.css";
import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [
        {
          id: "6da3a8cf-c923-4c77-8f80-c69c935fe1df",
          orderNumber: 1,
          responsiblePerson: "Joonatan Siloma",
          healthCareDistrict: "KYS",
          vaccine: "Antiqua",
          injections: 4,
          arrived: "2021-01-11T08:59:28.642790Z",
        },
        {
          id: "1251aa6c-ebaf-4e33-89d3-d6f210497b94",
          orderNumber: 2,
          responsiblePerson: "Tarvo Puro",
          healthCareDistrict: "TAYS",
          vaccine: "Antiqua",
          injections: 4,
          arrived: "2021-01-10T01:29:26.642846Z",
        },
        {
          id: "c00e2610-5bd9-4f84-9597-1e7febfae62c",
          orderNumber: 4,
          responsiblePerson: "Linda Väisälä",
          healthCareDistrict: "HYKS",
          vaccine: "Antiqua",
          injections: 4,
          arrived: "2021-01-08T05:33:37.642901Z",
        },
      ],
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
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  handleResize(e) {
    //TODO: get this to work
    console.log(e);
    this.gridApi && this.gridApi.sizeColumnsToFit();
  }

  handleRowsFetch = async () => {
    await fetch(`/orders?brand=antiqua`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  };

  onGridReady({ api }) {
    this.gridApi = api;
    this.gridApi.sizeColumnsToFit();
  }

  render() {
    const gridOptions = {
      rowData: this.state.rows,
      columnDefs: this.columnDefs,
      onGridReady: this.handleRowsFetch,
    };

    return (
      <div className="Vaccines">
        <div className="ag-theme-alpine">
          <AgGridReact gridOptions={gridOptions} />
        </div>
      </div>
    );
  }
}

export default App;
