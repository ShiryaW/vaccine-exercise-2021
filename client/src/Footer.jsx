import React, { Component } from "react";
import PropTypes from "prop-types";

export class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <div className="footer">
        <p>Total items: {this.props.totalItems}</p>
      </div>
    );
  };
}

Footer.propTypes = {
  totalItems: PropTypes.number.isRequired,
};

export default Footer;
