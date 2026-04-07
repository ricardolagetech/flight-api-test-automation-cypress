function ensureBaseUrl() {
  if (!Cypress.config('baseUrl')) {
    throw new Error('Defina API_BASE_URL para executar os testes da API real.');
  }
}

function getValidCredentials() {
  const user = Cypress.env('apiBasicUser') || 'interno';
  const pass = Cypress.env('apiBasicPass') || 'senha-forte-local';

  if (!user || !pass) {
    throw new Error('Defina API_BASIC_USER e API_BASIC_PASS para autenticar as requisições.');
  }

  return { user, pass };
}

Cypress.Commands.add('apiRequest', (options = {}) => {
  const { auth = 'valid', ...requestOptions } = options;

  ensureBaseUrl();

  const finalOptions = {
    failOnStatusCode: false,
    ...requestOptions,
  };

  if (auth === 'valid') {
    finalOptions.auth = getValidCredentials();
  }

  if (auth === 'invalid') {
    const credentials = getValidCredentials();

    finalOptions.auth = {
      user: `${credentials.user}-invalido`,
      pass: `${credentials.pass}-invalida`,
    };
  }

  return cy.request(finalOptions);
});

Cypress.Commands.add('postVooFromFixture', (fixtureName, options = {}) => {
  const { auth = 'valid', overrides = {} } = options;

  return cy.fixture(`voos/${fixtureName}`).then((payload) => {
    return cy.apiRequest({
      method: 'POST',
      url: '/voos',
      auth,
      body: {
        ...payload,
        ...overrides,
      },
    });
  });
});

Cypress.Commands.add('getVoos', (options = {}) => {
  const { auth = 'valid' } = options;

  return cy.apiRequest({
    method: 'GET',
    url: '/voos',
    auth,
  });
});