// https://docs.cypress.io/api/introduction/api.html

describe("Audio Player", () => {
  it("plays audio", () => {
    cy.visit("/");

    cy.get(".song-link:first").click();
    cy.get("#play-btn").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.get("#player-play-btn").click();
  });
});
