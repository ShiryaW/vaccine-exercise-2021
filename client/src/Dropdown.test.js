import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Dropdown from "./Dropdown";
import React from "react";
import { shallow } from "enzyme";

describe("Dropdown", () => {
  beforeEach(() => {
    configure({ adapter: new Adapter() });
  });

  it("renders the top bar with dropdown menu", () => {
    const props = {
      onChange: jest.fn(),
      onToggle: jest.fn(),
      buttonChecked: false,
      groupBy: "gender",
    };
    const dropdown = shallow(<Dropdown {...props} />);
    expect(dropdown).toMatchSnapshot();
  });
});
