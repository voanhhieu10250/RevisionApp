import styles from "./App.module.scss";
import { Component, Show } from "solid-js";
import { Routes, Route, A, useMatch } from "@solidjs/router";
import LoadDataPage from "./pages/LoadData";
import MenuPage from "./pages/Menu";
import EditDataPage from "./pages/EditData";
import AppInfoPage from "./pages/AppInfo";
import FlashCardsPage from "./pages/FlashCards";

const App: Component = () => {
  const isFlashCard = useMatch(() => "/flash-cards");
  const isMenu = useMatch(() => "/");

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <Show when={!isMenu()}>
          <A href="/" class={styles.backToMenu}>
            Back to menu
          </A>
        </Show>
        <Show when={!isFlashCard()}>
          <h1>Revision App</h1>
        </Show>
      </header>
      <Routes>
        <Route path="/" component={MenuPage} />
        <Route path="/load" component={LoadDataPage} />
        <Route path="/edit" component={EditDataPage} />
        <Route path="/info" component={AppInfoPage} />
        <Route path="/flash-cards" component={FlashCardsPage} />
        <Route
          path="/about"
          element={<div>This site was made with Solid</div>}
        />
      </Routes>
    </div>
  );
};

export default App;
