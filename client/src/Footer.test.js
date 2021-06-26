import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Footer from "./Footer";
import React from "react";
import { shallow } from "enzyme";

describe("Footer", () => {
  beforeEach(() => {
    configure({ adapter: new Adapter() });
  });

  it("renders the footer", () => {
    const dropdown = shallow(<Footer totalItems={1234} />);
    expect(dropdown).toMatchSnapshot();
  });
});
