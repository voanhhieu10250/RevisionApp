import styles from "./FlashCards.module.scss";
import leftArrow from "../assets/left-arrow.svg";
import rightArrow from "../assets/right-arrow.svg";
import {
  Accessor,
  Component,
  createSignal,
  For,
  onMount,
  Setter,
} from "solid-js";
import { Swiper, SwiperSlide } from "swiper/solid";
import "swiper/css";

const isButton = (element: HTMLElement) => {
  let el: HTMLElement | null = element;
  for (; el !== null && el.nodeName && !(el.nodeName === "BUTTON"); )
    el = el.parentNode as HTMLElement | null;
  return !!el;
};

const FlashCardsPage: Component = () => {
  const [words, setWords] = createSignal<
    (Word & { showDefi: Accessor<boolean>; setShowDefi: Setter<boolean> })[]
  >([]);
  const [winWidth, setWinWidth] = createSignal<number>(window.innerWidth);
  let slider: HTMLDivElement;

  onMount(async () => {
    window.electronAPI.setTitle("Flash Cards");
    window.electronAPI.handleWinResize((_, size) => {
      setWinWidth(size[0]);
    });

    const result = await window.electronAPI.getData(20);

    setWords(
      result.map((word) => {
        const [showDefi, setShowDefi] = createSignal<boolean>(false);
        return { ...word, showDefi, setShowDefi };
      })
    );
  });

  const scrollWidth = () => winWidth() / 1.5;

  return (
    <div class={styles.container}>
      <h2>Flash Cards</h2>
      <div class={styles.slider}>
        <div class={styles.slides} ref={(e) => (slider = e)}>
          <For each={words()}>
            {(word, idx) => {
              const handleFlip = (e: Event) => {
                if (!isButton(e.target as HTMLElement))
                  word.setShowDefi(!word.showDefi());
              };
              return (
                <div class={styles.flipCard}>
                  <div
                    classList={{
                      [styles.card]: true,
                      [styles.rotateCard]: word.showDefi(),
                    }}
                    onClick={handleFlip}
                  >
                    <div class={styles.cardInnerFront}>
                      {/* card head */}
                      <div class={styles.cardHeader}>
                        <small>
                          {idx() + 1}/{words().length}
                        </small>
                        <button class={styles.edit}>Edit</button>
                      </div>
                      {/* card body */}
                      <div class={styles.cardBody}>
                        <p>{word.text}</p>
                      </div>
                      {/* card food */}
                      <div class={styles.cardFooder}>
                        <button
                          onClick={() => {
                            slider.scrollLeft -= scrollWidth();
                          }}
                        >
                          <img src={leftArrow} alt="Go back" />
                        </button>
                        <button
                          onClick={() => {
                            word.setShowDefi(!word.showDefi());
                          }}
                        >
                          I forgot this one
                        </button>
                        <button
                          onClick={() => {
                            slider.scrollLeft += scrollWidth();
                          }}
                        >
                          <img src={rightArrow} alt="Go next" />
                        </button>
                      </div>
                    </div>

                    <div class={styles.cardInnerBack}>
                      {/* card head */}
                      <div class={styles.cardHeader}>
                        <small>
                          {idx() + 1}/{words().length}
                        </small>
                        <button class={styles.edit}>Edit</button>
                      </div>
                      {/* card body */}
                      <div class={styles.cardBody}>
                        <p>{word.definition}</p>
                      </div>
                      {/* card food */}
                      <div class={styles.cardFooder}>
                        <button
                          onClick={() => {
                            slider.scrollLeft -= scrollWidth();
                          }}
                        >
                          <img src={leftArrow} alt="Go back" />
                        </button>
                        <button
                          onClick={() => {
                            word.setShowDefi(!word.showDefi());
                          }}
                        >
                          I forgot this one
                        </button>
                        <button
                          onClick={() => {
                            slider.scrollLeft += scrollWidth();
                          }}
                        >
                          <img src={rightArrow} alt="Go next" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
};

export default FlashCardsPage;
