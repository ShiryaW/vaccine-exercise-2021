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
- enable filtering for expired vaccines by date

# Known issues
- some backend tests don't execute properly because they run before the database has time to set up. This has been an absolute pain in the neck for me to figure out and I put it on the backburner in order to get some actual content done in time. It's definitely #1 on the list of things to fix though.
- the sidebar calendar's width scales and I don't like it