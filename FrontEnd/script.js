console.log("Hello World!");

let works =[];

async function afficherWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");
  works = await reponse.json();
  console.log(works);
  genererImages(works);
}

afficherWorks();

function genererImages(works){

  const divImages = document.querySelector(".gallery");

  for(let i = 0 ; i < works.length ; i++){
    const projet =  works[i];

    const worksElement = document.createElement("figure");

    const imagesElement = document.createElement("img");
    imagesElement.src = projet.imageUrl;
    const nomElement = document.createElement("figcaption");
    nomElement.innerText = projet.title;

    divImages.appendChild(worksElement);
    worksElement.appendChild(imagesElement);
    worksElement.appendChild(nomElement);
    console.log(projet.imageUrl);

  }
}

let categories =[];

async function afficherCategories() {
  const reponse = await fetch("http://localhost:5678/api/works");
  categories = await reponse.json();
  console.log(categories);

}
afficherWorks();



