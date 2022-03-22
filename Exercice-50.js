/* Base URL of the web-service for the current user and access token */
const backend = "https://cawrest.ensimag.fr" // replace by the backend to use
const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoidGVpc3NpY28iLCJkZWxlZyI6Im5vdC1kZWZpbmVkIn0.MVXqNo_X8UgxuVDn0yjaphVsNmuoSRIiSc4mQTXTr-Y" //replace by yout token : go to BACKEND/getjwsDeleg/caw to obtain it
const wsBase = `${backend}/bmt/teissico/` // replace USER by your login used tu obtain TOKEN
/* Shows the identity of the current user */
function setIdentity() { //recupère l'identifiant de l'utiisateur et l'inscrit dans la page
	fetch("https://cawrest.ensimag.fr/whoami",
      {  method:'GET',
         headers: {"x-access-token":token,"content-type": "application/x-www-form-urlencoded; charset=UTF-8"}
      })
 .then(reponse => reponse.json())
 .then(identity => {
    let newContent = document.createTextNode(identity.data);
    let path = document.querySelector("h1 span.identity");
    path.appendChild(newContent);
  })

}

/* Sets the height of <div id="#contents"> to benefit from all the remaining place on the page */
function setContentHeight() {
	let availableHeight = window.innerHeight
	availableHeight -= document.getElementById("contents").offsetTop
	availableHeight -= 2 * document.querySelector('h1').offsetTop
	availableHeight -= 4 * 1
	document.getElementById("contents").style.height = availableHeight + "px"
}


/* Selects a new object type : either "bookmarks" or "tags" */
function selectObjectType(type) {
	//cas ou on selectionne tags
	if(type == "tags" &&   !document.querySelector("#menu li.tags").classList.contains("selected")){
    document.querySelector("#menu li.bookmarks").classList.remove("selected");
    document.querySelector("#menu li.tags").classList.add("selected");
    listTags();
    document.querySelector("#add div.tag").classList.add("selected");
  }
	//cas ou on selectionne bookmarks
  if(type == "bookmarks" && !document.querySelector("#menu li.bookmarks").classList.contains("selected")){
    document.querySelector("#menu li.tags").classList.remove("selected");
    document.querySelector("#menu li.bookmarks").classList.add("selected");
    listBookmarks();
    document.querySelector("#add div.tag").classList.remove("selected");
  }
}

/* Loads the list of all bookmarks and displays them */
function listBookmarks() {
	console.log("listBookmarks called")
	//TODO
}

/* Loads the list of all tags and displays them */
function listTags() {
	console.log("listTags called")
	//TODO
  document.querySelector("#items").innerHTML = "";
	//requete qui récupère l'ensemble des tags
  fetch("https://cawrest.ensimag.fr/bmt/teissico/tags",
      {  method:'GET',
         headers: {"x-access-token":token,"content-type": "application/x-www-form-urlencoded; charset=UTF-8"}
      })
 .then(reponse => reponse.json()) //transformation au format json
 .then(tags => { //traitement et ajout sur la page
    const tabTags = new Array();
    for(tag in tags.data){
      tabTags.push({"id":tags.data[tag].id,"name":tags.data[tag].name});
    }
    for(tab in tabTags){
      const newTag = document.querySelector("div.model.tag").cloneNode(true);
      newTag.classList.replace("model","item");
      newTag.setAttribute("num",tabTags[tab].id);
      newTag.querySelector("h2").innerHTML = "";
      newTag.querySelector("h2").appendChild(document.createTextNode(tabTags[tab].name));
      document.querySelector("#items").appendChild(newTag);
      //tag Edit Event
      newTag.addEventListener("click",() => clickTag(newTag), false);
    }

  })
}

/* Adds a new tag */
function addTag() {
  let nameTagToAdd = document.querySelector("div.tag input[type='text']").value;
  console.log(nameTagToAdd);
	//traitement si la zone de texte est vide
  if(nameTagToAdd == "" || nameTagToAdd == null){
    alert("Zone de texte vide --> création de tag impossible");
  }
	//Sinon: ajout d'un nouveau tag
  else{
    const body=new URLSearchParams();
    body.append("data",JSON.stringify({name:nameTagToAdd}));
    fetch("https://cawrest.ensimag.fr/bmt/teissico/tags",
        {  method:'POST',
           headers: {"x-access-token":token,"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
           body
        })
   .then(reponse => listTags());
	 document.querySelector("div.tag input[type='text']").value = "";
  }
}

/* Handles the click on a tag */
function clickTag(tag) {
	if(!tag.classList.contains("selected")){
		//camouflage desdonnées de la page
    try{
      document.querySelector("#items div.item.tag.selected h2").style = "";
      document.querySelector("#items div.item.tag.selected div").style = "display:none";
      document.querySelector("#items div.item.tag.selected").classList.remove("selected");

    }catch(error){}
    tag.classList.add("selected");
    try{
      document.querySelector("#items div.item.tag.selected h2").style = "display:none";
    }catch(error){}

		//création de l'appercu champ de texte et boutton si tag cliqué
		const newDiv = document.createElement("div");
    tag.appendChild(newDiv);
    const newChampText = document.createElement("input");
    newChampText.setAttribute("type", "text");
    newChampText.setAttribute("value", document.querySelector("#items div.item.tag.selected h2").textContent);
    newDiv.appendChild(newChampText);
    const newButtonModif = document.createElement("input");
    newButtonModif.setAttribute("type","button");
    newButtonModif.setAttribute("value","Modify name");
    newDiv.appendChild(newButtonModif);
    const newButtonRemove = document.createElement("input");
    newButtonRemove.setAttribute("type","button");
    newButtonRemove.setAttribute("value","Remove tag");
    newDiv.appendChild(newButtonRemove);

    //Ajout des Event listener pour les deux boutons crééswitch
    newButtonModif.addEventListener("click",() => modifyTag(),false);
    newButtonRemove.addEventListener("click",() => removeTag(),false);
  }
}

/* Performs the modification of a tag */
function modifyTag() {
  //Modification du tag par requete PUT
  let modifiedName = document.querySelector("#items div.item.tag.selected input[type='text']").value;
  let url = "https://cawrest.ensimag.fr/bmt/teissico/tags/"+document.querySelector("#items div.item.tag.selected").getAttribute("num");
  const body=new URLSearchParams()
  body.append("data",JSON.stringify({name:modifiedName}));
  fetch(url,
      {  method:'PUT',
         headers: {"x-access-token":token,"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
         body
      })
 .then(reponse => listTags())
}

/* Removes a tag */
function removeTag() {
	//Suppression du tag par requete DELETE
  let url = "https://cawrest.ensimag.fr/bmt/teissico/tags/"+document.querySelector("#items div.item.tag.selected").getAttribute("num");
  fetch(url,
      {  method:'DELETE',
         headers: {"x-access-token":token,"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
      })
 .then(reponse => listTags())
}
/* On document loading */
function miseEnPlace() {

	/* Give access token for future ajax requests */
	// Put the name of the current user into <h1>
	setIdentity();
	// Adapt the height of <div id="contents"> to the navigator window
	setContentHeight();
	window.addEventListener("resize",setContentHeight);
	// Listen to the clicks on menu items
	// Initialize the object type to "tags"
  selectObjectType("tags");
	//Listen to clicks on the "add tag" button
  const tagAdded = document.querySelector("#addTag");
  tagAdded.addEventListener("click",() => addTag(),false);
  //Listen to click on Tags or Bookmarks item menu
  const liTags = document.querySelector("#menu li.tags");
  liTags.addEventListener("click",() => selectObjectType("tags"), false);
  const liBookmarks= document.querySelector("#menu li.bookmarks");
  liBookmarks.addEventListener("click",() => selectObjectType("bookmarks"), false);

}
window.addEventListener('load',miseEnPlace,false);
