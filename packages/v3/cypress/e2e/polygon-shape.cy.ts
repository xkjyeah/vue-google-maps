describe('PolygonShape component', () => {
  it('should contain a 2 polygon shape with 8 points in each of them', function () {
    cy.visit('/');
    cy.get('button[name=polygon]').click();
    cy.get('.gmv-map').should('exist');
    cy.get('.gm-style').should('be.visible');
    cy.get(
      'div > div > [style="position: absolute; left: 0px; top: 0px; z-index: 106; width: 100%;"] > div > div',
    ).should('have.length', 16);
  });
});
