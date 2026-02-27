console.log("Hello World!");

let works =[];
const divImages = document.querySelector(".gallery");
const divButtons = document.querySelector(".btn");
const token = localStorage.getItem("token");


afficherWorks();
suprimerBoutons();
bandeauAdmin();
deconnexion();
log()

//récupere les images + titres
async function afficherWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");
  works = await reponse.json();
  console.log(works);
  genererGalerie(works);

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

function suprimerBoutons(){
  if(token){
    divButtons.style.display = "none";
  }
}

function bandeauAdmin(){
  const bandeau = document.querySelector(".adminEdi");
  if(token){
    bandeau.style.display = "block";
  }
}


function log(){
  const logout = document.querySelector(".logoutindex")
  const login = document.querySelector(".logindex")
  if(token){
    login.style.display = "none";
    logout.style.display = "block";
  }
}

function deconnexion(){
  const logout = document.querySelector(".logoutindex")
  logout.addEventListener("click", async function(){
    localStorage.removeItem("token");
    window.location.reload();
  })
}

