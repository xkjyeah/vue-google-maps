describe('AutocompleteInput component', () => {
  it('should set a marker on the selected place', function () {
    const search = 'la serranita';

    cy.visit('/');
    cy.get('button[name=autocomplete]').click();
    cy.get('.gmv-map').should('exist');
    cy.get('.gm-style').should('be.visible');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    // Click the input to trigger a real pointer interaction — this sets
    // document.activeElement, which Google Places Autocomplete checks before
    // firing prediction requests. Using focus() alone dispatches a synthetic
    // event that does NOT reliably set document.activeElement in headless Electron.
    cy.get('input').should('be.visible').click();
    // 'pac-target-input' is added synchronously by Google's Autocomplete
    // constructor. If this assertion times out, the Autocomplete instance was
    // never attached to the input (initialization failure). If it passes,
    // initialization is fine and the problem is at the Places API response layer.
    cy.get('input').should('have.class', 'pac-target-input');
    // Delay between keystrokes gives the Places API time to react to each
    // character and return suggestions before the next one is typed.
    cy.get('input').type(search, { delay: 100 });
    // Increased timeout: on CI the Places API response can take longer than 4 s
    cy.get('.pac-item', { timeout: 10000 }).first().click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.get('#use-place-btn').click();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cy.window().should((win: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(win.__mapMarkers__).to.have.length(1);
    });
  });
});
