console.log("Hello World!");

let works =[];
const divImages = document.querySelector(".gallery");
const modaleImages = document.querySelector(".modaleGallery");
const divButtons = document.querySelector(".btn");
const token = localStorage.getItem("token");
const modifictaion = document.querySelector(".btnModifier");


afficherWorks();
suprimerBoutons();
deconnexion();
afficheModale();

//récupere les images + titres
async function afficherWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");
  works = await reponse.json();
  console.log(works);

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
  console.log(categories);
  genererBoutons(categories);
  ajouterPhoto(categories)

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

  buttonAll.className = "btnCategories";
  buttonAll.innerText = "Tous";
  divButtons.appendChild(buttonAll);
  buttonAll.addEventListener("click", function(){
    console.log("Tous");
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
}

//trie les images en fonction de leurs catégories
function boutonTrie(button,category, works){
  button.addEventListener("click", function(){
    console.log("ID => "+category.id+" /nom =>"+category.name );
    const worksTrie = works.filter(works => works.categoryId === category.id);
    worksTrie.forEach(works => console.log("(TITRE) = "+works.title + " (catégorie) = "+works.categoryId));
    document.querySelector(".gallery").innerHTML = "";
    genererGalerie(worksTrie)
  })
}

//
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

//
function deconnexion(){
  const logout = document.querySelector(".logoutindex")

  logout.addEventListener("click", async function(){
    localStorage.removeItem("token");
    window.location.reload();
  })
}

//
function afficheModale(){
  const overlay = document.querySelector(".overlay");
  const modale = document.querySelector(".modale");
  const ajoutImage = document.querySelector("#ajoutImage");

  modifictaion.addEventListener("click", async function(){
    overlay.style.display = "block";
    modale.style.display = "block";
  })

  const fermeModale = document.querySelectorAll(".close");
  fermeModale.forEach((btn)=>{
    btn.addEventListener("click", async function(){
      overlay.style.display = "none";
      modale.style.display = "none";
      ajoutImage.style.display = "none";
  })
  })

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

//
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

//
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
      console.log(works);

      if (!reponse.ok) {
        throw new Error(`Statut de réponse : ${reponse.status}`);
      }
      await afficherWorks()
    } catch (erreur) {
      console.error(erreur.message);
    }
}

//
function ajouterPhoto(categories){
  const selectCat = document.querySelector("#categorie");

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    selectCat.appendChild(option);
  });
}

//
function boutonSuppression(){
  const boutonSup = document.querySelectorAll(".iconeSup");

  boutonSup.forEach(btn=>{
    btn.addEventListener("click", async function(){
      const idBtnSup = Number(btn.dataset.id);
      const work = works.find((w) =>w.id === idBtnSup);
      if(work){
        console.log("Image supprimer : ", work.title);
        await deleteWork(idBtnSup);
      }
    })
  })
}

