console.log("Hello World!");

let works =[];

async function afficherWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");
    works = await reponse.json();
  console.log(works);
}

afficherWorks();

const doubles = works.map(work => {
    console.log("test");
  return work.id;
});
console.log(doubles);

const nombres = [1, 2, 3, 4, 5];

const double = nombres.map(nombre => {
  return nombre * 2;
});

console.log(double);

