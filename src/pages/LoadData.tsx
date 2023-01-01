import { useNavigate } from "@solidjs/router";
import { createSignal, For, onMount, Show } from "solid-js";
import styles from "./LoadData.module.scss";

export default function LoadDataPage() {
  const [words, setWords] = createSignal<Word[]>([]);
  const [filename, setFilename] = createSignal<string>("");
  const [filePath, setFilePath] = createSignal<string>("");
  const [progress, setProgress] = createSignal<number>(0);
  const navigate = useNavigate();
  let fileInput: HTMLInputElement;

  onMount(() => {
    window.electronAPI.setTitle("Load your file!");
  });

  function handleFileSelect(evt: Event) {
    const file = (evt.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();

    console.log(file);
    reader.onprogress = function (this: FileReader, evt: ProgressEvent) {
      if (evt.lengthComputable) {
        const percentComplete = (evt.loaded / evt.total) * 100;
        setProgress(percentComplete);
      }
    };
    reader.onload = function (this: FileReader): void {
      const text = this.result as string;
      let result: { text: string; definition: string }[] = [];

      if (text) {
        result = text
          .split("---")
          .filter((item) => item !== "")
          .map((item) => {
            const obj = item.split("__defi__");
            return { text: obj[0].trim(), definition: obj[1].trim() };
          });

        setWords(result);
        setFilename(file.name);
        setFilePath((file as File & { path: string }).path || "");
      }
    };
    reader.readAsText(file);
  }

  async function handleSubmitData() {
    const success = await window.electronAPI.saveData(
      words(),
      filename(),
      filePath()
    );
    if (success) {
      navigate("/");
    }
  }

  return (
    <div>
      <form>
        <div class={styles.inputFileContainer}>
          <input
            ref={(e) => (fileInput = e)}
            class={styles.inputFile}
            id="data-file"
            type="file"
            accept=".txt"
            onChange={handleFileSelect}
          />
          <label
            tabindex="0"
            for="data-file"
            class={styles.inputFileTrigger}
            onClick={() => fileInput.focus()}
          >
            Select a file...
          </label>
        </div>
        <p class={styles.fileReturn}>
          {filePath() ? filePath() : progress() + "%"}
        </p>
      </form>

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
  );
}
