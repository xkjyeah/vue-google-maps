/* eslint-disable @typescript-eslint/no-explicit-any */
describe('MarkerIcon component', () => {
  afterEach(() => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
  });

  it('should add 4 markers on the map', function () {
    cy.visit('/');
    cy.get('button[name=marker]').click();
    cy.get('.gmv-map').should('exist');
    cy.get('.gm-style').should('be.visible');
    cy.window().should((win: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(win.__mapMarkers__).to.have.length(4);
    });
  });

  it('should hide 2 markers from the map', function () {
    cy.visit('/');
    cy.get('button[name=marker]').click();
    cy.get('.gmv-map').should('exist');
    cy.get('.gm-style').should('be.visible');
    cy.get('#visibility2').click();
    cy.window().should((win: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(win.__mapMarkers__).to.have.length(2);
    });
  });

  it('should make visible again the 2 hidden markers on the map', function () {
    cy.visit('/');
    cy.get('button[name=marker]').click();
    cy.get('.gmv-map').should('exist');
    cy.get('.gm-style').should('be.visible');
    cy.get('#visibility2').click();
    cy.window().should((win: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(win.__mapMarkers__).to.have.length(2);
    });
    cy.get('#visibility2').click();
    cy.window().should((win: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(win.__mapMarkers__).to.have.length(4);
    });
  });

  it('should clean the markers array from the map removing 2 of the 4 markers', function () {
    cy.visit('/');
    cy.get('button[name=marker]').click();
    cy.get('.gmv-map').should('exist');
    cy.get('.gm-style').should('be.visible');
    cy.get('.gmv-map').should('be.visible');
    cy.get('#empty').click();
    cy.window().should((win: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(win.__mapMarkers__).to.have.length(2);
    });
  });

  it('should fill the markers array from the map adding the 2 removed markers', function () {
    cy.visit('/');
    cy.get('button[name=marker]').click();
    cy.get('.gmv-map').should('exist');
    cy.get('.gm-style').should('be.visible');
    cy.get('#empty').click();
    cy.window().should((win: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(win.__mapMarkers__).to.have.length(2);
    });
    cy.get('#empty').click();
    cy.window().should((win: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(win.__mapMarkers__).to.have.length(4);
    });
  });
});
