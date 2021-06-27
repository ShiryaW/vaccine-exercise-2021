import "./App.css";
import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import { Calendar } from "react-calendar";
import { Dropdown } from "./Dropdown";
import { Footer } from "./Footer";

import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { VIEWS } from "./util/constants";
import {
  parseTimestampToDate,
  parseDateToTimestamp,
  parseDateToUIString,
  getNumOfVaccinesExpiredBy,
  defaultResponseHandler,
  capitalize,
} from "./util/helpers";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowData: [],
      selectedView: VIEWS.ANTIQUA.value,
      totalItems: 0,
      isGroupingView: false,
      groupingDisabled: false,
      expiredDoses: 0,
      expiredBottles: 0,
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

  handleRowsFetch = async (selectedView, date) => {
    if (selectedView === VIEWS.VACCINATIONS.value) {
      await this.fetchVaccinations(date);
    } else {
      await this.fetchManufacturer(date);
      if (date) {
        const { expiredBottles, expiredDoses } =
          await getNumOfVaccinesExpiredBy(selectedView, date);
        this.setState({
          expiredBottles,
          expiredDoses,
        });
      }
    }
  };

  fetchVaccinations = async (date) => {
    const url = date ? `/vaccinations?date=${date}` : `/vaccinations`;

    await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then(defaultResponseHandler)
      .then((data) => {
        data.forEach((row) => {
          row.vaccinationDate = parseDateToUIString(
            parseTimestampToDate(row.vaccinationDate)
          );
        });

        this.setState(
          {
            rowData: data,
            totalItems: data.length,
            isGroupingView: false,
            groupingDisabled: true,
          },
          () => {
            this.gridApi && this.gridApi.setColumnDefs(this.getColumnDefs());
            this.gridApi && this.gridApi.sizeColumnsToFit();
          }
        );
      });
  };

  fetchManufacturer = async (date) => {
    const url = date
      ? `/orders?brand=${encodeURIComponent(
          this.state.selectedView
        )}&date=${encodeURIComponent(date)}`
      : `/orders?brand=${encodeURIComponent(this.state.selectedView)}`;

    await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then(defaultResponseHandler)
      .then((data) => {
        data.forEach((row) => {
          row.arrived = parseDateToUIString(parseTimestampToDate(row.arrived));
        });

        this.setState(
          {
            rowData: data,
            totalItems: data.length,
            isGroupingView: false,
            groupingDisabled: false,
          },
          () => {
            this.gridApi && this.gridApi.setColumnDefs(this.getColumnDefs());
            this.gridApi && this.gridApi.sizeColumnsToFit();
          }
        );
      });
  };

  getColumnDefs = () => {
    if (this.state.selectedView !== VIEWS.VACCINATIONS.value) {
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
          ...(this.state.isGroupingView
            ? { rowGroup: true }
            : { rowGroup: false }),
        },
        {
          headerName: "Vaccination date",
          field: "vaccinationDate",
          sortable: true,
          unSortIcon: true,
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
        expiredBottles: 0,
        expiredDoses: 0,
      },
      async () => {
        await this.handleRowsFetch(this.state.selectedView);
      }
    );
  };

  onCalendarInput = async (value) => {
    const timestamp = parseDateToTimestamp(value);
    await this.handleRowsFetch(this.state.selectedView, timestamp);
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
        <div className="grid">
          <Dropdown
            onChange={this.onSelectionChanged}
            onToggle={this.onToggle}
            groupBy={
              this.state.selectedView === VIEWS.VACCINATIONS.value
                ? "gender"
                : "healthcare district"
            }
            buttonChecked={this.state.isGroupingView}
          />
          <div className="ag-theme-alpine">
            <AgGridReact
              gridOptions={this.gridOptions}
              rowData={this.state.rowData}
            />
          </div>
          <Footer totalItems={this.state.totalItems} />
        </div>
        <div className="sidebar">
          <Calendar onChange={this.onCalendarInput} view="month" />
          {!(this.state.selectedView === VIEWS.VACCINATIONS.value) ? (
            <div className="day-data">
              <p>
                No. of {capitalize(this.state.selectedView)} vaccines that have
                expired by this day: <b>{this.state.expiredDoses}</b>
              </p>
              <p>
                No. of {capitalize(this.state.selectedView)} bottles that have
                expired by this day: <b>{this.state.expiredBottles}</b>
              </p>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  };
}

export default App;
