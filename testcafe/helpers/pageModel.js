import { Selector, ClientFunction } from "testcafe";

class Dropdown {
  constructor() {
    this.selectBox = Selector("#selectBox");
    this.selectOptions = this.selectBox.find("option");
    this.groupingText = Selector(".MuiTypography-root");
    this.groupingToggle = Selector(".MuiSwitch-root");
  }
}

class Grid {
  constructor() {
    this.headers = Selector(".ag-header-row");
    this.rowData = Selector(".ag-center-cols-container");
    this.rows = this.rowData.find(".ag-row");
    this.rowNth = nth => this.rows.nth(nth);
  }
}

class Sidebar {
  constructor() {
    this.calendar = Selector(".react-calendar");
    this.dayButton = day => this.calendar.find("abbr").withExactText(day);
  }
}

class Footer {
  constructor() {
    this.text = Selector(".footer p");
  }
}

class AppPageModel {
  constructor() {
    this.dropdown = new Dropdown();
    this.grid = new Grid();
    this.sidebar = new Sidebar();
    this.footer = new Footer();

    this.refresh = async ()  => {
      await ClientFunction(() => {
        document.location.reload();
      })();
    }
  }
}

export default AppPageModel;