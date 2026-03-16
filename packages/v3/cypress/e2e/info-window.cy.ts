/* eslint-disable @typescript-eslint/no-unused-expressions */
describe('InfoWindow component', () => {
  it('should click on the 3 clickable markers and display a different text on the info-window when each of it is clicked', function () {
    cy.visit('/');
    cy.get('button[name=info-window]').click();
    cy.get('.gmv-map').should('exist');
    cy.get('.gm-style').should('be.visible');
    cy.get('[role=button]', { timeout: 8000 }).each((el) => {
      cy.wrap(el).click({ force: true });
      cy.get('strong')
        .invoke('text')
        .then((txt) => {
          const regex = /Marker\s\d/;
          expect(regex.test(txt)).to.be.true;
        });
    });
  });
});
