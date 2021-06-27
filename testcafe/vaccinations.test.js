import AppPageModel from "./helpers/pageModel";

const URL = "http://localhost:3000";
const pageModel = new AppPageModel();

const HEADERS = {
  ID: "Vaccination ID",
  BOTTLE: "Source bottle",
  GENDER: "Gender",
  DATE: "Vaccination date",
  GROUP: "Group"
}

fixture("Vaccinations view with in-memory database").page(URL).beforeEach(async t => {
  await pageModel.refresh();
  await t.maximizeWindow();
  await t.click(pageModel.dropdown.selectBox);
  await t.click(pageModel.dropdown.selectOptions.withText("vaccinations"));
});

test("Should show the corresponding grid headers", async t => {
  const headerCells = pageModel.grid.headers.find(".ag-header-cell");

  await t.expect(headerCells.withText(HEADERS.ID).visible).ok();
  await t.expect(headerCells.withText(HEADERS.BOTTLE).visible).ok();
  await t.expect(headerCells.withText(HEADERS.GENDER).visible).ok();
  await t.expect(headerCells.withText(HEADERS.DATE).visible).ok();
});

test("Should allow the user to sort by gender and vaccination date", async t => {
  const headerCells = pageModel.grid.headers.find(".ag-header-cell");
  const header = (text) => headerCells.withText(text);
  const sortIcon = (h) => header(h).find(".ag-sort-none-icon");
  const sortIconAsc = (h) => header(h).find(".ag-sort-ascending-icon");

  await t.expect(sortIcon(HEADERS.GENDER).visible)
    .ok()
    .expect(sortIcon(HEADERS.DATE).visible)
    .ok()
    .expect(sortIcon(HEADERS.ID).visible)
    .notOk("Should not be able to sort by vax ID")
    .expect(sortIcon(HEADERS.BOTTLE).visible)
    .notOk("Should not be able to sort by source bottle");

  const firstRow = pageModel.grid.rowNth(0);
  const firstRowVaxID = firstRow.find(".ag-cell").withAttribute("col-id", "vaccinationId");

  const firstRowIDUnsorted = "4b30e155-7105-4346-8d1b-9411178cf74a";
  const firstRowIDSortedByGenderAsc = "23141063-8fa3-4f0d-8cee-c6fadedde057";

  await t.expect(firstRowVaxID.innerText)
    .eql(firstRowIDUnsorted)
    .click(sortIcon(HEADERS.GENDER))
    .expect(sortIcon(HEADERS.GENDER).visible)
    .notOk("The sorting icon should change on click to reflect the sorting state")
    .expect(sortIconAsc(HEADERS.GENDER).visible)
    .ok()
    .expect(firstRowVaxID.innerText)
    .eql(firstRowIDSortedByGenderAsc);
});

test("Should allow the user to filter rows based on the date of vaccination", async t => {
  const calendarNavigation = pageModel.sidebar.calendar.find(".react-calendar__navigation__label").child();
  const calendarNavigationPrev = pageModel.sidebar.calendar.find(".react-calendar__navigation__prev-button");
  const firstRow = pageModel.grid.rowNth(0);
  const firstRowVaxID = firstRow.find(".ag-cell").withAttribute("col-id", "vaccinationId");

  const firstRowVaxIDOnApril9 = "50660e7e-99c7-4330-942e-448527a62492";

  while ((await calendarNavigation.innerText) !== "April 2021") {
    await t.click(calendarNavigationPrev)
      .wait(200); // This is to prevent testcafe from clicking too fast and getting to March before the condition evaluates to false.
                  // It happened twice and now I trust nothing. (≖_≖)
  }

  await t.click(pageModel.sidebar.dayButton("9"))
    .expect(firstRowVaxID.innerText)
    .eql(firstRowVaxIDOnApril9);
});

test("Should group the data into rows by gender when grouping is toggled", async t => {
  const firstHeader = pageModel.grid.headers.find(".ag-header-cell").withAttribute("aria-colindex", "1");
  const firstRow = pageModel.grid.rowNth(0);
  const firstRowFirstCell = firstRow.find(".ag-cell").withAttribute("aria-colindex", "1");

  await t.click(pageModel.dropdown.groupingToggle)
    .expect(firstHeader.innerText)
    .eql(HEADERS.GROUP)
    .expect(firstRowFirstCell.innerText)
    .contains("nonbinary");
});
