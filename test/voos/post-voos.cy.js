const validationScenarios = [
  {
    title: 'deve rejeitar cadastro sem companhia',
    fixture: 'post-voo-sem-companhia.json',
    expectedMessage: 'Companhia aérea é obrigatória.',
  },
  {
    title: 'deve rejeitar cadastro sem origem',
    fixture: 'post-voo-sem-origem.json',
    expectedMessage: 'Origem é obrigatória.',
  },
  {
    title: 'deve rejeitar cadastro sem destino',
    fixture: 'post-voo-sem-destino.json',
    expectedMessage: 'Destino é obrigatório.',
  },
  {
    title: 'deve rejeitar cadastro sem data',
    fixture: 'post-voo-sem-data.json',
    expectedMessage: 'Data deve estar no formato YYYY-MM-DD.',
  },
  {
    title: 'deve rejeitar cadastro com data fora do padrao aceito',
    fixture: 'post-voo-data-invalida.json',
    expectedMessage: 'Data deve estar no formato YYYY-MM-DD.',
  },
  {
    title: 'deve rejeitar cadastro com preco igual a zero',
    fixture: 'post-voo-preco-zero.json',
    expectedMessage: 'Preço deve ser um número maior que zero.',
  },
  {
    title: 'deve rejeitar cadastro com preco nao numerico',
    fixture: 'post-voo-preco-nao-numerico.json',
    expectedMessage: 'Preço deve ser um número maior que zero.',
  },
  {
    title: 'deve rejeitar cadastro com milhas igual a zero',
    fixture: 'post-voo-milhas-zero.json',
    expectedMessage: 'Milhas deve ser um número maior que zero.',
  },
  {
    title: 'deve rejeitar cadastro com milhas nao numericas',
    fixture: 'post-voo-milhas-nao-numericas.json',
    expectedMessage: 'Milhas deve ser um número maior que zero.',
  },
  {
    title: 'deve rejeitar cadastro com duracao invalida',
    fixture: 'post-voo-duracao-invalida.json',
    expectedMessage: 'Duração deve estar no formato HH:mm (ex: 02:30).',
  },
  {
    title: 'deve rejeitar cadastro com escalas fora do tipo booleano',
    fixture: 'post-voo-escalas-invalido.json',
    expectedMessage: "Campo 'escalas' deve ser true ou false.",
  },
];

describe('POST /voos', () => {
  it('deve cadastrar um voo valido e disponibiliza-lo para consulta', () => {
    cy.fixture('voos/post-voo-valido.json').then((payload) => {
      cy.apiRequest({
        method: 'POST',
        url: '/voos',
        body: payload,
      }).then((postResponse) => {
        expect(postResponse.status).to.eq(201);
        expect(postResponse.body).to.include(payload);
        expect(postResponse.body).to.have.property('id').that.is.a('number');

        cy.getVoos().then((getResponse) => {
          expect(getResponse.status).to.eq(200);
          expect(getResponse.body).to.be.an('array');

          const createdFlight = getResponse.body.find((voo) => voo.id === postResponse.body.id);

          expect(createdFlight).to.deep.equal(postResponse.body);
        });
      });
    });
  });

  it('deve cadastrar um voo sem horario, pois o campo e opcional', () => {
    cy.fixture('voos/post-voo-valido-sem-horario.json').then((payload) => {
      cy.apiRequest({
        method: 'POST',
        url: '/voos',
        body: payload,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.include(payload);
        expect(response.body).to.have.property('id').that.is.a('number');
        expect(response.body).to.not.have.property('horario');
      });
    });
  });

  it('deve aceitar valores de borda validos para preco, milhas e duracao', () => {
    cy.fixture('voos/post-voo-valido-borda.json').then((payload) => {
      cy.apiRequest({
        method: 'POST',
        url: '/voos',
        body: payload,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.include(payload);
        expect(response.body).to.have.property('id').that.is.a('number');
      });
    });
  });

  it('deve retornar 401 quando a autenticacao nao for enviada', () => {
    cy.fixture('voos/post-voo-valido.json').then((payload) => {
      cy.apiRequest({
        method: 'POST',
        url: '/voos',
        auth: 'missing',
        body: payload,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.deep.equal({
          mensagem: 'Autenticação obrigatória.',
        });
      });
    });
  });

  it('deve retornar 401 quando as credenciais forem invalidas', () => {
    cy.fixture('voos/post-voo-valido.json').then((payload) => {
      cy.apiRequest({
        method: 'POST',
        url: '/voos',
        auth: 'invalid',
        body: payload,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.deep.equal({
          mensagem: 'Credenciais inválidas.',
        });
      });
    });
  });

  validationScenarios.forEach(({ title, fixture, expectedMessage }) => {
    it(title, () => {
      cy.postVooFromFixture(fixture).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.equal({
          mensagem: expectedMessage,
        });
      });
    });
  });
});