import { A } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import styles from "../App.module.scss";

export default function MenuPage() {
  const [dataInfo, setDataInfo] = createSignal({
    filename: "none",
    size: 0,
  });

  onMount(async () => {
    window.electronAPI.setTitle("Menu");
    let info = await window.electronAPI.getDataInfo();
    setDataInfo(info);
  });

  return (
    <div>
      <h2>Menu</h2>
      <div>
        <small>
          <u>Your data:</u> {dataInfo().filename}
          <br />
          <u>Size:</u> {dataInfo().size}
        </small>
      </div>
      <ul class={styles.menu}>
        <li>
          <A href="/load" class={styles.link}>
            Load Data
          </A>
        </li>
        <li>
          <A href="/flash-cards" class={styles.link}>
            Flash Cards
          </A>
        </li>
        <li>
          <A href="/edit" class={styles.link}>
            Edit Data
          </A>
        </li>
        <li>
          <A href="/info" class={styles.link}>
            App Info
          </A>
        </li>
      </ul>
    </div>
  );
}
