describe('KmlLayer component', () => {
  it('should have a kml icon in the map', function () {
    cy.visit('/');
    cy.get('button[name=kml-layer]').click();
    cy.get('.gmv-map').should('exist');
    cy.get('.gm-style').should('be.visible');
    cy.get('.gmv-map-container').should('be.visible');
    cy.get(
      '[src^="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i11!2i329!3i794!4i256!2m15!1e2!2skml%3AcXOw0bjKUSmlnTN2l67v0Sai6WfXhSSWuyNaDD0mAzh6xfi2fYnBo78Y2Eg!4m2!1sks!2sts%"]',
    ).should('exist');
  });
});
