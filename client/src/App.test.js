import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

import App from "./App";
import React from "react";
import { shallow } from "enzyme";

describe("App", () => {
  beforeEach(() => {
    configure({ adapter: new Adapter() });
  });

  it("renders the UI", () => {
    expect(shallow(<App />)).toMatchSnapshot();
  });
});
