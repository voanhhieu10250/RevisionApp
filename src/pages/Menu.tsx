import { A } from "@solidjs/router";
import styles from "../App.module.scss";

export default function MenuPage() {
  return (
    <div>
      <h2>Menu</h2>
      <ul class={styles.menu}>
        <li>
          <A href="/load" class={styles.link}>
            Load Data
          </A>
        </li>
        <li>
          <A href="/edit" class={styles.link}>
            Edit Data
          </A>
        </li>
        <li>
          <A href="/flash-cards" class={styles.link}>
            Flash Cards
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
