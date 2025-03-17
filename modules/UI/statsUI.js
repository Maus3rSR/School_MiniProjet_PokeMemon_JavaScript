const countHTML = document.querySelector("#stat_nombre_de_coups");
const countRecordHTML = document.querySelector("#stat_nombre_de_coups_record");

function updateCountHTML(count) {
  countHTML.textContent = count;
}

function updateCountRecordHTML(count) {
  countRecordHTML.textContent = count;
}

export { updateCountHTML, updateCountRecordHTML };
