# vaccine-exercise-2021
Web UI for visualizing COVID-19 vaccination data. The user can view data for orders coming from 3 suppliers as well as data for vaccinations that have been carried out. The data can be grouped by healthcare district (orders) or gender of the vaccinated person (vaccinations) and filtered by date of vaccination/source bottle arrival. The data is also sortable by order number, date of arrival, and responsible person name (orders) or gender and vaccination date (vaccinations). The total number of items for each view is shown in the footer.

# How to run
1) run `npm install` and then `cd client && npm install` to install dependencies
2) run `npm start` to launch app on http://localhost:3000 (and server on port 3001)

# How to execute tests
1) `npm run lint` to lint the code
2) `npm run test-client` to execute frontend tests
3) `npm run test-testcafe` to execute automated testcafe tests in the browser (Firefox by default, available only when the app is running!)
4) `npm run test-server` to execute backend tests (NOTE: will fail at the moment, see Known issues)

# Improvement items
- allow for more filtering options, e.g. by order number or ID
- more thorough test coverage (some time-consuming-looking test cases were knowingly skipped for the purposes of Speed™)

# Known issues
- the numbers for expired bottles & doses don't look quite right but despite my best efforts I have not been able to figure out what is wrong with them