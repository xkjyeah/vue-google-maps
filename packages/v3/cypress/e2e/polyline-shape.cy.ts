describe('PolylineShape component', () => {
  it('should contain a 2 polyline shape with 3 points', function () {
    cy.visit('/');
    cy.get('button[name=polyline]').click();
    cy.get('.gmv-map').should('exist');
    cy.get('.gm-style').should('be.visible');
    cy.get(
      'div > div > [style="position: absolute; left: 0px; top: 0px; z-index: 106; width: 100%;"] > div > div',
    ).should('have.length', 3);
  });
});
