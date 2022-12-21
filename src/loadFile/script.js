window.electronAPI.setTitle("Load your file!");

const form = document.querySelector("form");
const output = document.getElementById("output");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  let data = new FormData(e.target);
  let fr = new FileReader();

  fr.onload = async function () {
    const text = await window.electronAPI.toHTML(fr.result);
    output.innerHTML = text;
  };

  fr.readAsText(data.get("file"));
});
