const gridHTML = document.querySelector("#grille_de_jeu");
const bushListHTML = gridHTML.querySelectorAll(".box");

function hideBush(index) {
  bushListHTML[index].style.display = "none";
}

hideBush(0);
