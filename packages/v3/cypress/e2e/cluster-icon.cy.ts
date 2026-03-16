/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
describe('ClusterIcon component', () => {
  it('should have a cluster of 2 markers', function () {
    cy.visit('/');
    cy.get('button[name=cluster]').click();
    cy.get('.gmv-map').should('exist');
    cy.get('.gm-style').should('be.visible');
    cy.get('[aria-label=Map]').within(() => {
      cy.window().then((win) => {
        const { google, GoogleMapsCallback, __gmc__ } =
          win as Cypress.AUTWindow & {
            google: Record<any, any>;
            GoogleMapsCallback: string;
            __gmc__: { map: Record<any, any> };
          };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        __gmc__.map.setZoom(3);

        expect(google).to.not.be.undefined;
        expect(typeof google).to.be.eq('object');
        expect(typeof GoogleMapsCallback).to.be.eq('function');
        expect(__gmc__).to.not.be.undefined;
        expect(typeof __gmc__).to.be.eq('object');
        expect(__gmc__.map).to.be.instanceof(google.maps.Map);
      });
    });
    cy.get('[aria-label="Cluster of 2 markers"]')
      .should('be.visible')
      .should('have.attr', 'title', 'Cluster of 2 markers');
  });
});
