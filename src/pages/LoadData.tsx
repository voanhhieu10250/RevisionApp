import { useNavigate } from "@solidjs/router";
import { createSignal, For, onMount, Show } from "solid-js";
import styles from "../App.module.scss";

export default function LoadDataPage() {
  const [words, setWords] = createSignal<Word[]>([]);
  const [filename, setFilename] = createSignal<string>("");
  const navigate = useNavigate();

  onMount(() => {
    window.electronAPI.setTitle("Load your file!");
  });

  function handleFileSelect(evt: Event) {
    let file = (evt.target as HTMLInputElement).files![0];
    console.log(file);

    let reader = new FileReader();
    reader.onload = function () {
      let text = reader.result as string;
      let result: { text: string; definition: string }[] = [];

      if (text) {
        result = text
          .split("---")
          .filter((item) => item !== "")
          .map((item) => {
            let obj = item.split("__defi__");
            return { text: obj[0].trim(), definition: obj[1].trim() };
          });

        setWords(result);
        setFilename(file.name);
      }
    };
    reader.readAsText(file);
  }

  async function handleSubmitData() {
    const success = await window.electronAPI.saveData(words(), filename());
    if (success) {
      navigate("/");
    }
  }

  return (
    <div>
      <div>
        <label for="file">Select a file: </label>
        <br />
        <input
          type="file"
          id="file"
          name="file"
          accept=".txt"
          class={styles.fileInput}
          onchange={handleFileSelect}
        />

        <Show when={words().length > 0}>
          <div class={styles.result}>
            <h3>Your data:</h3>

            <div>
              <input
                type="button"
                value="Submit Data"
                onClick={handleSubmitData}
              />
            </div>
            <div class={styles.datas}>
              <For each={words()}>
                {(word, i) => (
                  <div class={styles.card}>
                    <h4>
                      <b>{word.text}</b>
                    </h4>
                    <hr />
                    <p>{word.definition}</p>
                    <small>{i()}</small>
                  </div>
                )}
              </For>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}
