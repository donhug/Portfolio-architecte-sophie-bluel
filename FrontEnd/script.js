console.log("Hello World!");

let works =[];

async function afficherWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");
  works = await reponse.json();
  console.log(works);
  genererGalerie(works);


  let categoriesArray = new Set();
  works.forEach(works => {
    if (works.category){
      categoriesArray.add(JSON.stringify(works.category));
    }
  })
  const categories =Array.from(categoriesArray).map(cat => JSON.parse(cat));
  console.log(categories);

  genererBoutons(categories)
}

afficherWorks();

function genererGalerie(works){
  const divImages = document.querySelector(".gallery");

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

function genererBoutons(categories){
  const divButtons = document.querySelector(".btn");

  for(let i = 0; i < categories.length; i++ ){
    const button = categories[i];

    const buttonEl = document.createElement("button");
    buttonEl.className = "btn";
    //buttonEl.setAttribute("type", "button");
    buttonEl.innerText = categories[i].name;

    divButtons.appendChild(buttonEl);

  }
}



