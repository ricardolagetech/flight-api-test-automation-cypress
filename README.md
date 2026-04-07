# Flight API Test Automation with Cypress

API test automation portfolio project built with Cypress to validate the `POST /voos` endpoint.

The project highlights a maintainable test structure, reusable custom commands, data-driven validation scenarios, and clear coverage of authentication and business-rule behavior.

Target API:
https://github.com/ricardolagetech/flight-api-tests

## Project Goal

The suite validates flight creation behavior under different conditions, including:

- successful flight creation
- authentication failures
- required field validations
- format validations
- business rule validations

## Target API

This automation project was built against the API repository above.

To run this suite locally, the target API must be running before the tests start.

## Tech Stack

- Cypress
- Node.js
- dotenv

Note: the test runner structure and assertions used in this project are provided by Cypress.

## Project Structure

```text
test/
	fixtures/
		voos/
	support/
		commands.js
		e2e.js
	voos/
		post-voos.cy.js
cypress.config.js
package.json
README.md
```

### Folder Responsibilities

- `test/voos`
Contains the automated test scenarios for the `POST /voos` endpoint.

- `test/fixtures/voos`
Contains JSON test data files organized by scenario.

- `test/support/commands.js`
Contains reusable Cypress custom commands for authentication and HTTP requests.

- `cypress.config.js`
Defines Cypress configuration, including base URL, fixture folder, and environment variables.

## Test Strategy

The suite was structured to keep a clear separation between:

- test data
- request execution
- response validation

To support that approach, the project uses:

- fixtures to store payloads
- custom commands to reduce duplication
- data-driven validation scenarios for repetitive negative cases

## Custom Commands

### `cy.apiRequest(options)`

A wrapper around `cy.request()` with additional responsibilities:

- validate whether `baseUrl` is configured
- apply valid or invalid authentication
- allow negative response validation through `failOnStatusCode: false`

### `cy.postVooFromFixture(fixtureName, options)`

Loads a flight fixture and sends a `POST /voos` request.

### `cy.getVoos(options)`

Executes a `GET /voos` request to validate previously created records.

## Prerequisites

Before running the tests, make sure you have:

- Node.js installed
- npm installed
- the `flight-api-tests` API running
- valid Basic Auth credentials

## Environment Configuration

This suite uses the following environment variables:

```env
API_BASE_URL=http://localhost:3000
API_BASIC_USER=interno
API_BASIC_PASS=senha-forte-local
```

### Environment Variables Description

- `API_BASE_URL`: base URL of the target API
- `API_BASIC_USER`: Basic Auth username
- `API_BASIC_PASS`: Basic Auth password

If these values are not provided, the project falls back to local default values configured for development and study purposes.

## How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Run the tests in headless mode

```bash
npm test
```

or

```bash
npm run cy:run
```

### 3. Open Cypress in interactive mode

```bash
npm run cy:open
```

## Current Coverage

At the moment, the suite covers:

- `POST /voos`

Including validation of:

- valid flight creation
- flight creation without the optional `horario` field
- missing authentication
- invalid authentication
- missing required fields
- invalid data types
- invalid formats
- numeric business rule violations

## Known API Defect

When running the suite against the local API, there is a known mismatch in the validation message for the `milhas` field.

### Expected requirement message

`Milhas deve ser um número maior que zero.`

### Actual API response

`Milhas deve ser um numero maior que zero.`

The automated test was intentionally kept aligned with the expected requirement in order to expose the defect.

## Visual Evidence

The screenshot below shows the failing validation scenario for `milhas`, making the API defect visible during test execution.

![Known defect evidence: milhas validation mismatch](docs/images/known-defect-milhas-validation.png)

## What This Project Demonstrates

This project was built to demonstrate:

- API test automation using Cypress
- separation between test data and test logic
- reusable custom commands
- positive and negative scenario coverage
- maintainable test design
- defect identification and documentation

## Possible Next Steps

Natural extensions for this suite include:

- adding tests for `GET /voos`
- adding tests for `GET /voos/:id`
- adding tests for `PUT /voos/:id`
- adding tests for `DELETE /voos/:id`
- integrating the suite into a CI pipeline
- publishing execution reports

## Author

Ricardo Lage

QA automation portfolio project.