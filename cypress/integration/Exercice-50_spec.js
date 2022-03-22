const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoidGVpc3NpY28iLCJkZWxlZyI6Im5vdC1kZWZpbmVkIn0.MVXqNo_X8UgxuVDn0yjaphVsNmuoSRIiSc4mQTXTr-Y" //replace by yout token : go to BACKEND/getjwsDeleg/caw to obtain it

describe('Test',() => {

  //Initialisation de la base de donnée pour test
  fetch("https://cawrest.ensimag.fr/bmt/teissico/reinit",
      {  method:'POST',
         headers: {"x-access-token":token,"content-type": "application/x-www-form-urlencoded; charset=UTF-8"}
      })

  //Connection a la page que l'on doit tester
  it('Connection à la page',() => {
    cy.visit('Exercice-50.html')
  })

  //Test ajout nouveau tag
  it('Add new tag',() => {
    cy.get("#add div input[type='text']").type('NewTestTag')
    cy.get("#add div #addTag").click()
    cy.get("#items").should('contain','NewTestTag')
  })

  //cliquer sur tag et modifier le premier tag en ‘JAVASCRIPT!!!’
  it('Click on \"Tags\"',() => {
    cy.get("#menu li.tags").click()
  })
  it('Modify first tag',() => {
    cy.get("#items div:first-child").click()
    cy.get("#items div:first-child div input:first-child").click().clear().type('JAVASCRIPT!!!')
    cy.get("#items div:first-child div input[value='Modify name']").click()
  })

  //vérification qu'un tag s'appelle bien désormais JAVASCRIPT!!!
  it('Verify the tag have been created',() => {
    cy.get('#items').should('contain','JAVASCRIPT!!!')
  })

  //Suppression d'un tag (newTestTag)
  it('Delete newTestTag',() => {
    cy.get("#items").contains('NewTestTag').click()
    cy.get("#items div.selected div input[value='Remove tag']").click()
  })

  //Test modification du backend pour tester uniquement le frontend #POUR ALLER PLUS LOIN
  it('Test front by modifying back',() => {
    cy.intercept('GET', '/bmt/teissico/tags', { fixture: 'front-no-back.json'})
    cy.get("#add div input[type='text']").type('FrontInterceptBack')
    cy.get("#add div #addTag").click()
  })

})
