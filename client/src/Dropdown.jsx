import React, { Component } from "react";
import PropTypes from "prop-types";
import BRANDS from "./util/constants";

export class Dropdown extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <div className="dropdown">
        <p>Select a manufacturer:</p>
        <select id="selectBox" onChange={this.props.onChange}>
          <option value={BRANDS.ANTIQUA.value}>{BRANDS.ANTIQUA.label}</option>
          <option value={BRANDS.SOLARBUDDHICA.value}>
            {BRANDS.SOLARBUDDHICA.label}
          </option>
          <option value={BRANDS.ZERPFY.value}>{BRANDS.ZERPFY.label}</option>
        </select>
      </div>
    );
  };
}

Dropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
};
