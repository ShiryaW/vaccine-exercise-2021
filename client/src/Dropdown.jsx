import React, { Component } from "react";
import { Switch, FormControlLabel } from "@material-ui/core";
import PropTypes from "prop-types";
import { VIEWS } from "./util/constants";

export class Dropdown extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <div className="dropdown">
        <p>Select view:</p>
        <select id="selectBox" onChange={this.props.onChange}>
          <option value={VIEWS.ANTIQUA.value}>{VIEWS.ANTIQUA.label}</option>
          <option value={VIEWS.SOLARBUDDHICA.value}>
            {VIEWS.SOLARBUDDHICA.label}
          </option>
          <option value={VIEWS.ZERPFY.value}>{VIEWS.ZERPFY.label}</option>
          <option value={VIEWS.VACCINATIONS.value}>
            {VIEWS.VACCINATIONS.label}
          </option>
        </select>
        {!this.props.groupingDisabled ? (
          <FormControlLabel
            label={`Group by ${this.props.groupBy}`}
            labelPlacement="start"
            control={<Switch checked={this.props.buttonChecked} />}
            onChange={this.props.onToggle}
          ></FormControlLabel>
        ) : (
          <></>
        )}
      </div>
    );
  };
}

Dropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  buttonChecked: PropTypes.bool.isRequired,
  groupBy: PropTypes.string.isRequired,
  groupingDisabled: PropTypes.bool,
};
