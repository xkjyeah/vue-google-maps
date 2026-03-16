/* eslint-disable @typescript-eslint/no-unused-expressions */

/* eslint-disable @typescript-eslint/no-explicit-any */
// https://docs.cypress.io/api/introduction/api.html

describe('MapLayer component', () => {
  it('visits the app root url', () => {
    const newCenter = { lat: -31.4196, lng: -64.1939 };
    cy.visit('/');
    cy.get('button[name=map]').click();
    cy.contains('h2', 'Test E2E: Map layer');
    cy.get('.gmv-map').should('exist');
    cy.get('.gm-style').should('be.visible');
    cy.get('.gmv-map-container > .gmv-map > div');
    cy.get('.gmv-map-container > .gmv-map-hidden');
    const inputLat = () => cy.get('input[name=lat]');
    const inputLng = () => cy.get('input[name=lng]');
    inputLat().clear();
    inputLat().type(newCenter.lat.toString());
    inputLat().tab();
    inputLng().clear();
    inputLng().type(`${newCenter.lng.toString()}{enter}`);
    inputLng().tab();
    cy.window().then((win) => {
      const { google, GoogleMapsCallback, __gmc__ } =
        win as Cypress.AUTWindow & {
          google: Record<any, any>;
          GoogleMapsCallback: string;
          __gmc__: { map: Record<any, any> };
        };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const center = __gmc__.map.getCenter();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const rawCenter = { lat: center.lat(), lng: center.lng() };

      expect(google).to.not.be.undefined;
      expect(typeof google).to.be.eq('object');
      expect(typeof GoogleMapsCallback).to.be.eq('function');
      expect(__gmc__).to.not.be.undefined;
      expect(typeof __gmc__).to.be.eq('object');
      expect(__gmc__.map).to.be.instanceof(google.maps.Map);
      expect(rawCenter.lat).to.be.eq(newCenter.lat);
      expect(rawCenter.lng).to.be.eq(newCenter.lng);
    });
  });
});
