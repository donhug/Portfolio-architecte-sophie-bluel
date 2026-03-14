console.log("Hello World!");

let works =[];
const divImages = document.querySelector(".gallery");
const modaleImages = document.querySelector(".modaleGallery");
const divButtons = document.querySelector(".btn");
const token = localStorage.getItem("token");
const modifictaion = document.querySelector(".btnModifier");
const oublie = document.querySelector(".oublie")


afficherWorks();
suprimerBoutons();
deconnexion();
afficheModale();
ajoutPhoto();
listeCat()
preview()
//récupere les images + titres
async function afficherWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");
  works = await reponse.json();
  genererGalerie(works);
  galerieModale(works)

//récupere les 3 catégories
  let categoriesArray = new Set();
  works.forEach(works => {
    if (works.category){
      categoriesArray.add(JSON.stringify(works.category));
    }
  })
  const categories =Array.from(categoriesArray).map(cat => JSON.parse(cat));
  genererBoutons(categories);


  document.querySelector(".modaleGallery").innerHTML = "";
  document.querySelector(".gallery").innerHTML = "";
  genererGalerie(works);
  galerieModale(works);
  boutonSuppression();
}

// genère la gallerie dans la DIV gallery et crée les éléments pour les images + titres
function genererGalerie(works){

  for(let i = 0; i < works.length ; i++){
    const projet =  works[i];
    const worksElement = document.createElement("figure");
    const imagesElement = document.createElement("img");
    imagesElement.src = projet.imageUrl;
    const nomElement = document.createElement("figcaption");
    nomElement.innerText = projet.title;

    divImages.appendChild(worksElement);
    worksElement.appendChild(imagesElement);
    worksElement.appendChild(nomElement);
  }
}

// genère les boutons
function genererBoutons(categories){
  const buttonAll = document.createElement("button");

  buttonAll.className = "btnCategories active";
  buttonAll.innerText = "Tous";
  divButtons.appendChild(buttonAll);
  buttonAll.addEventListener("click", function(){
    document.querySelector(".gallery").innerHTML = "";
    genererGalerie(works)
  })

  for(let i = 0; i < categories.length; i++ ){
    const buttonCat = document.createElement("button");
    buttonCat.className = "btnCategories";
    buttonCat.innerText = categories[i].name;

    divButtons.appendChild(buttonCat);
    boutonTrie(buttonCat,categories[i], works);
  }
  couleurBtn()
}

//trie les images en fonction de leurs catégories
function boutonTrie(button,category, works){
  button.addEventListener("click", function(){
    const worksTrie = works.filter(works => works.categoryId === category.id);
    worksTrie.forEach(works => console.log("(TITRE) = "+works.title + " (catégorie) = "+works.categoryId));
    document.querySelector(".gallery").innerHTML = "";
    genererGalerie(worksTrie)
  })
}

//change la couleur des boutons au clic
function couleurBtn(){
  let boutons = document.querySelectorAll(".btnCategories")
  boutons.forEach(function (bouton){
    bouton.addEventListener("click", function(){
      boutons.forEach(b => b.classList.remove("active"));
        bouton.classList.remove("active");
      bouton.classList.add("active");
    })
  })
}

//mode admin, supprime les boutons, change le login en logout,
function suprimerBoutons(){
  const bandeau = document.querySelector(".adminEdi");
  const logout = document.querySelector(".logoutindex")
  const login = document.querySelector(".logindex")
  const adminIcone = document.querySelector(".adminIcone");
  const btnModifier = document.querySelector(".btnModifier");

  if(token){
    divButtons.style.display = "none";
    bandeau.style.display = "block";
    login.style.display = "none";
    logout.style.display = "block";

  }else{
    adminIcone.style.display = "none";
    btnModifier.style.display = "none";
  }
}

//au clic sur logout supprime le token et on passe en mode visiteur
function deconnexion(){
  const logout = document.querySelector(".logoutindex")

  logout.addEventListener("click", async function(){
    localStorage.removeItem("token");
    window.location.reload();
  })
}

//affiche la modale et un filtre gris en fond de page,
function afficheModale(){
  const overlay = document.querySelector(".overlay");
  const modale = document.querySelector(".modale");
  const ajoutImage = document.querySelector("#ajoutImage");

  modifictaion.addEventListener("click", async function(){
    overlay.style.display = "block";
    modale.style.display = "block";
  })
//ferme la modale au clic sur la croix
  const fermeModale = document.querySelectorAll(".close");
  const form = document.querySelector("#formulaireAjout");
  fermeModale.forEach((btn)=>{
    btn.addEventListener("click", async function(){
      overlay.style.display = "none";
      modale.style.display = "none";
      ajoutImage.style.display = "none";
      form.reset();
      previewRest();
      oublie.style.display="none"
  })
  })

  overlay.addEventListener("click", async function(){
    overlay.style.display = "none";
    modale.style.display = "none";
    ajoutImage.style.display = "none";
  })
//affiche la page pour ajouter une image
  const btnAjout = document.querySelector(".btnAjout");
  btnAjout.addEventListener("click", async function(){
    modale.style.display = "none";
    ajoutImage.style.display = "block";
  })
  const retour = document.querySelector(".return");
  retour.addEventListener("click", async function(){
    modale.style.display = "block";
    ajoutImage.style.display = "none";
  })
}

//affiche la galerie dans la modale
async function galerieModale(works){
  for(let i = 0; i < works.length ; i++){
    const projet =  works[i];

    const worksElement = document.createElement("figure");
    const imagesModale = document.createElement("img");
    imagesModale.classList.add = "imageModale";
    worksElement.classList.add("imageFig");
    imagesModale.src = projet.imageUrl;

    modaleImages.appendChild(worksElement);
    worksElement.insertAdjacentHTML(
        "beforeend",
        `
      <img class="imageModale" src="${projet.imageUrl}" alt="">
      <button class="iconeSup" data-id="${projet.id}">
        <i class="fa-solid fa-trash-can poubelle"></i>
      </button>
      `
    );
  }
}

//possibilité de supprimer des images
async function deleteWork(id) {
    const url = "http://localhost:5678/api/works/"+id;

    try {
      const reponse = await fetch(url,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!reponse.ok) {
        throw new Error(`Statut de réponse : ${reponse.status}`);
      }
      await afficherWorks()
    } catch (erreur) {
      console.error(erreur.message);
    }
}

//au clic sur la poubelle l'image est supprimé
function boutonSuppression(){
  const boutonSup = document.querySelectorAll(".iconeSup");

  boutonSup.forEach(btn=>{
    btn.addEventListener("click", async function(){
      const idBtnSup = Number(btn.dataset.id);
      const work = works.find((w) =>w.id === idBtnSup);
      if(work){
        await deleteWork(idBtnSup);
      }
    })
  })
}

//affiche les catégories lors de l'ajout d'une image
async function listeCat(){
  let selection = []
  const selectCat = document.querySelector("#categorie");
  const categories = await fetch("http://localhost:5678/api/categories");
  selection = await categories.json();
  const optionVide = document.createElement("option");
  optionVide.value = "";
  selectCat.innerHTML = "";
  selectCat.appendChild(optionVide);

  selection.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    selectCat.appendChild(option);
  });

}

//affiche l'image dans la zone
function preview(){
  const cacher = document.querySelectorAll(".preview");
  const drop = document.querySelector("#photo");
  const zoneAjout = document.querySelector(".zoneAJout");

  drop.addEventListener("change", e => {
    cacher.forEach(c => {
      c.style.display="none";
    })
    const preView = document.querySelector("#photo").files[0];
    const url = URL.createObjectURL(preView);
    const miniImg = document.createElement("img")
    miniImg.classList.add("affiche");
    miniImg.src = url;
    zoneAjout.appendChild(miniImg);
  })
}

function previewRest() {
  const cacher = document.querySelectorAll(".preview");
  const miniImg = document.querySelector(".affiche");
  cacher.forEach(c => {
    c.style.display="block";
  })
  if(miniImg){
    miniImg.remove();
  }
}

//envoie image+titre+catégorie a l'API
async function ajoutPhoto(){
  const form = document.querySelector("#formulaireAjout");
  const nouveau = document.querySelector("#validerApi");

  nouveau.addEventListener("click", async function(){
    const image = document.querySelector("#photo").files[0]
    const title = document.querySelector("#title")
    const category = document.querySelector("#categorie")

    if(!image || !title.value || !category.value){
      oublie.style.display="block"
    }
    else{
      //gestion de l'envoi de l'image + titre + catégorie
      const nouvelleImage = new FormData();
      nouvelleImage.append("image", image);
      nouvelleImage.append("title", title.value);
      nouvelleImage.append("category", category.value);

      try {
        const reponse = await fetch("http://localhost:5678/api/works/",{
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body:nouvelleImage
        });

        if (!reponse.ok) {
          throw new Error(`Statut de réponse : ${reponse.status}`);
        }
        form.reset();
        previewRest();
        await afficherWorks();
        oublie.style.display="none"
      } catch (erreur) {
        console.error(erreur.message);
      }
    }

  })
}

