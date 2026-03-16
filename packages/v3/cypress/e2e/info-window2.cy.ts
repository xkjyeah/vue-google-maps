describe('InfoWindow component 2', () => {
  it('should click on the 3 buttons inside of every info-window, and the marker and its info-window must be removed from the screen', function () {
    cy.visit('/');
    cy.get('button[name=info-window2]').click();
    cy.get('.gmv-map').should('exist');
    cy.get('.gm-style').should('be.visible');

    cy.get('.info-window-content > button', { timeout: 8000 })
      .should('exist')
      .should('have.length', 3);
    cy.get('.info-window-content > button', { timeout: 8000 }).each((el) => {
      cy.wrap(el).click({ force: true });
    });
    cy.get('.info-window-content > button', { timeout: 8000 }).should(
      'have.length',
      0,
    );
  });
});
