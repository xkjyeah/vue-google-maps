describe('CircleShape component', () => {
  it('should contain a circle shape with 5 points', function () {
    cy.visit('/');
    cy.get('button[name=circle]').click();
    cy.get('.gmv-map').should('exist');
    cy.get('.gm-style').should('be.visible');
    cy.get('[style="position: absolute; left: 0px; top: 0px; z-index: 0;"]')
      .last()
      .within(() => {
        cy.get(
          '[style="display: block; width: 11px; height: 11px; cursor: pointer; touch-action: none; position: absolute; left: -5px; top: -5px;"]',
        )
          .should('exist')
          .should('have.length', 1);
        cy.get(
          '[style="display: block; width: 11px; height: 11px; cursor: row-resize; touch-action: none; position: absolute; left: -5px; top: -45px;"]',
        )
          .should('exist')
          .should('have.length', 1);
        cy.get(
          '[style="display: block; width: 11px; height: 11px; cursor: row-resize; touch-action: none; position: absolute; left: -5px; top: 33px;"]',
        )
          .should('exist')
          .should('have.length', 1);
        cy.get(
          '[style="display: block; width: 11px; height: 11px; cursor: col-resize; touch-action: none; position: absolute; left: 34px; top: -5px;"]',
        )
          .should('exist')
          .should('have.length', 1);
        cy.get(
          '[style="display: block; width: 11px; height: 11px; cursor: col-resize; touch-action: none; position: absolute; left: -44px; top: -5px;"]',
        )
          .should('exist')
          .should('have.length', 1);
      });
  });
});
