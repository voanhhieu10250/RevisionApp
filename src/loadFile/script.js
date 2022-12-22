window.electronAPI.setTitle("Load your file!");

const form = document.querySelector("form");
const output = document.getElementById("output");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  let fdata = new FormData(e.target);
  let fr = new FileReader();

  fr.onload = async function () {
    const dataObj = await window.electronAPI.toObj(fr.result);
    renderCards(dataObj);
    console.log(dataObj);
  };
  fr.readAsText(fdata.get("file"));
});

function renderCards(fileData) {
  for (let idx = 0; idx < fileData.length; idx++) {
    const e = fileData[idx];
    const html = `
    <div class="card text-center" style="width: 18rem" key="card-${idx}" >
      <div class="card-body">
        <h5 class="card-title">${e.word}</h5>
        <p class="card-text">
          ${e.definition}
        </p>
        <button onclick="cardclick(${e})" class="btn btn-primary">Go somewhere</button>
      </div>
    </div>
          `;
    output.innerHTML += html;
  }
}
