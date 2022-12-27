import styles from "./FlashCards.module.scss";
import {
  batch,
  Component,
  createEffect,
  createSignal,
  For,
  on,
  onMount,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import { Swiper, SwiperSlide } from "swiper/solid";
import type { Swiper as SwiperRef } from "swiper";
import { Navigation, EffectCreative, Keyboard } from "swiper";
import Card from "../components/Card";
import type { CardType } from "../components/Card";
import { A } from "@solidjs/router";

const isButton = (element: HTMLElement) => {
  let el: HTMLElement | null = element;
  if (el.hasChildNodes()) {
    for (let i = 0; i < el.childNodes.length; i++) {
      const child = el.childNodes[i];
      if (child.nodeName === "BUTTON") {
        return false;
      }
    }
  }
  for (; el !== null && el.nodeName && !(el.nodeName === "BUTTON"); )
    el = el.parentNode as HTMLElement | null;
  return !!el;
};

const FlashCardsPage: Component = () => {
  const [dbSize, setDbSize] = createSignal(0);
  const [cardsPerRound, setCardsPerRound] = createSignal<number>(20);
  const [words, setWords] = createStore<CardType[]>([]);
  const [swiper, setSwiper] = createSignal<SwiperRef | null>(null);
  const [showResult, setShowResult] = createSignal<boolean>(false);
  const [isShowForgot, setIsShowForgot] = createSignal<boolean>(false);
  const [forgotIndexes, setForgotIndexes] = createSignal<number[]>([]);

  onMount(async () => {
    window.electronAPI.setTitle("Flash Cards");
    let infodata = await window.electronAPI.getDataInfo();
    const result = await window.electronAPI.getData(undefined, cardsPerRound());
    batch(() => {
      setDbSize(infodata.size);
      setWords(
        result.map((word, idx) => {
          return { ...word, showDefi: false, isForgot: false, _id: idx };
        })
      );
    });
  });

  createEffect(
    on(swiper, (swiper) => {
      // Swiper events only work after swiper is initialized
      // If you want to use swiper events, you need to use createEffect
      swiper?.on("keyPress", (s, keyCode) => {
        if (s.isEnd && parseInt(keyCode) === 39) {
          setIsShowForgot(false);
          setShowResult(true);
        }
      });
    })
  );

  // Update forgotWords when words change
  createEffect(
    on(
      isShowForgot,
      (isShowForgot) => {
        // console.log("words change");
        if (!isShowForgot) {
          setForgotIndexes(
            forgotIndexes().filter((idx) => words[idx].isForgot)
          );
        }
      },
      { defer: true }
    )
  );

  // setForgotWords(forgotWords.filter((word) => word.isForgot));
  const handleCardPerRoundChange = async (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const value = target.value === "full" ? undefined : parseInt(target.value);
    const result = await window.electronAPI.getData(undefined, value);

    batch(() => {
      setCardsPerRound(value ?? dbSize());
      setWords(
        result.map((word, idx) => {
          return { ...word, showDefi: false, isForgot: false, _id: idx };
        })
      );
    });
    swiper()?.update();
  };

  const goNextCard = () => {
    swiper()?.slideNext();
    if (swiper()?.isEnd) {
      batch(() => {
        setIsShowForgot(false);
        setShowResult(true);
      });
    }
  };
  const goPrevCard = () => {
    swiper()?.slidePrev();
  };
  const handleReviewForgot = () => {
    batch(() => {
      setShowResult(false);
      setIsShowForgot(true);
      setWords(forgotIndexes(), "showDefi", false);
    });
    swiper()?.update();
    swiper()?.slideTo(0, 0);
  };
  const handleNextRound = async () => {
    let oldLength = words.length;
    let tempId = words.length;
    const result = await window.electronAPI.getData(
      words.length,
      cardsPerRound()
    );
    batch(() => {
      setShowResult(false);
      setIsShowForgot(false);
      setWords([
        ...words,
        ...result.map((word) => {
          return { ...word, showDefi: false, isForgot: false, _id: tempId++ };
        }),
      ]);
    });
    swiper()?.update();
    swiper()?.slideTo(oldLength, 0);
  };
  const handleRemoveForgotCards = () => {
    batch(() => {
      setWords(forgotIndexes(), {
        isForgot: false,
        showDefi: false,
      });
      setForgotIndexes([]);
    });
  };
  const handleFlip = (word: CardType, e: Event) => {
    if (!isButton(e.target as HTMLElement)) {
      setWords([word._id], "showDefi", (showDefi) => !showDefi);
    }
  };
  const toggleForgotBtn = (word: CardType) => {
    batch(() => {
      if (!isShowForgot()) {
        if (!word.isForgot && !forgotIndexes().includes(word._id))
          setForgotIndexes([...forgotIndexes(), word._id]);
        if (word.isForgot && forgotIndexes().includes(word._id))
          setForgotIndexes(forgotIndexes().filter((idx) => idx !== word._id));
      }
      setWords([word._id], "isForgot", (isForgot) => !isForgot);
    });
  };

  const list = () =>
    !isShowForgot() ? words : forgotIndexes().map((idx) => words[idx]);

  return (
    <div class={styles.container}>
      <h2>Flash Cards (round {Math.round(words.length / cardsPerRound())})</h2>
      <div class={styles.roundOption}>
        <label for="cardsPerRound">Cards per round:&nbsp;</label>
        <select
          name="cardPerRound"
          title="Card per round"
          onChange={handleCardPerRoundChange}
        >
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="50">50</option>
          <option value="full">Full</option>
        </select>
      </div>
      <div class={styles.slider}>
        <Show when={!showResult()}>
          <div class={styles.slides}>
            <Swiper
              modules={[Navigation, EffectCreative, Keyboard]}
              initialSlide={0}
              keyboard={{
                enabled: true,
                pageUpDown: false,
              }}
              navigation={{
                prevEl: null,
                nextEl: null,
              }}
              effect="creative"
              creativeEffect={{
                prev: {
                  translate: ["-120%", 0, -500],
                },
                next: {
                  translate: ["120%", 0, -500],
                },
              }}
              speed={500}
              allowTouchMove={false}
              spaceBetween={30}
              slidesPerView={1}
              onSwiper={(swiper) => setSwiper(swiper)}
            >
              <For each={list()}>
                {(word, idx) => {
                  return (
                    <SwiperSlide>
                      <Card
                        word={word}
                        title={`${idx() + 1}/${
                          isShowForgot() ? forgotIndexes().length : dbSize()
                        }`}
                        handleFlip={handleFlip}
                        toggleForgotBtn={toggleForgotBtn}
                        goNextCard={goNextCard}
                        goPrevCard={goPrevCard}
                      />
                    </SwiperSlide>
                  );
                }}
              </For>
              <SwiperSlide></SwiperSlide>
            </Swiper>
          </div>
        </Show>
        <Show when={showResult()}>
          <div class={styles.endRound}>
            <div class={styles.modal}>
              <h3>End of round</h3>
              <p>Words saved for review: {forgotIndexes().length} words</p>
              <Show
                when={forgotIndexes().length > 0}
                fallback={<p>Good Job!</p>}
              >
                <ul>
                  <For each={forgotIndexes()}>
                    {(id) => <li>{words[id].text}</li>}
                  </For>
                </ul>
                <button onClick={handleReviewForgot}>
                  Review forgotten cards
                </button>
                <button onClick={handleRemoveForgotCards}>
                  Remove all forgotten cards
                </button>
              </Show>
              <Show
                when={words.length !== dbSize()}
                fallback={
                  <A href="/" style={{ color: "#b318f0" }}>
                    Back to menu
                  </A>
                }
              >
                <button onClick={handleNextRound}>Next round</button>
              </Show>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default FlashCardsPage;
