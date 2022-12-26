import styles from "./FlashCards.module.scss";
import {
  Component,
  createEffect,
  createSignal,
  For,
  onMount,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import { Swiper, SwiperSlide } from "swiper/solid";
import type { Swiper as SwiperRef } from "swiper";
import { Navigation, EffectCreative, Keyboard } from "swiper";
import Card from "../components/Card";
import type { CardType } from "../components/Card";

const isButton = (element: HTMLElement) => {
  let el: HTMLElement | null = element;
  for (; el !== null && el.nodeName && !(el.nodeName === "BUTTON"); )
    el = el.parentNode as HTMLElement | null;
  return !!el;
};

const FlashCardsPage: Component = () => {
  const [dbSize, setDbSize] = createSignal(0);
  const [cardsPerRound, setCardsPerRound] = createSignal<number>(20);
  const [words, setWords] = createStore<CardType[]>([]);
  const [swiper, setSwiper] = createSignal<SwiperRef | null>(null);
  const [isLastSlide, setIsLastSlide] = createSignal<boolean>(false);
  const [showResult, setShowResult] = createSignal<boolean>(false);
  const [forgotWords, setForgotWords] = createStore<CardType[]>([]);
  const [isShowForgot, setIsShowForgot] = createSignal<boolean>(false);

  onMount(async () => {
    window.electronAPI.setTitle("Flash Cards");
    let infodata = await window.electronAPI.getDataInfo();
    setDbSize(infodata.size);
    const result = await window.electronAPI.getData(undefined, cardsPerRound());
    setWords(
      result.map((word, idx) => {
        return { ...word, showDefi: false, isForgot: false, _id: idx };
      })
    );
  });

  createEffect(() => {
    if (swiper()) {
      swiper()?.on("slideChange", () => {
        console.log(
          swiper()?.activeIndex,
          swiper()?.isBeginning,
          swiper()?.isEnd
        );
        if (swiper()?.isEnd) setIsLastSlide(true);
        else setIsLastSlide(false);
      });
      swiper()?.on("keyPress", (_, keyCode) => {
        if (isLastSlide() && parseInt(keyCode) === 39) {
          setIsShowForgot(false);
          setShowResult(true);
        }
      });
    }
  });

  // Update forgotWords when words change
  createEffect(() => {
    if (!isShowForgot()) {
      setForgotWords(
        words
          .filter((word) => word.isForgot)
          .map((w) => ({ ...w, showDefi: false }))
      );
    }
  });

  // Update words when forgotWords change
  createEffect(() => {
    if (forgotWords.length > 0 && isShowForgot())
      setWords(
        forgotWords.filter((word) => !word.isForgot).map((word) => word._id),
        (word) => ({ ...word, isForgot: false, showDefi: false })
      );
  });

  // setForgotWords(forgotWords.filter((word) => word.isForgot));
  const handleCardPerRoundChange = async (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const value = target.value === "full" ? undefined : parseInt(target.value);
    const result = await window.electronAPI.getData(undefined, value);

    setIsLastSlide(false);
    setCardsPerRound(value ?? dbSize());
    setWords(
      result.map((word, idx) => {
        return { ...word, showDefi: false, isForgot: false, _id: idx };
      })
    );
    swiper()?.update();
  };

  const goNextCard = () => {
    swiper()?.slideNext();
    if (swiper()?.isEnd) {
      setIsShowForgot(false);
      setShowResult(true);
    }
  };
  const goPrevCard = () => {
    swiper()?.slidePrev();
  };
  const handleReviewForgot = () => {
    setIsLastSlide(false);
    setShowResult(false);
    setIsShowForgot(true);
    swiper()?.slideTo(0);
  };
  const handleNextRound = async () => {
    let oldLength = words.length;
    let tempId = words.length;
    setIsLastSlide(false);
    setShowResult(false);
    setIsShowForgot(false);
    const result = await window.electronAPI.getData(
      words.length,
      cardsPerRound()
    );
    setWords([
      ...words,
      ...result.map((word) => {
        return { ...word, showDefi: false, isForgot: false, _id: tempId++ };
      }),
    ]);
    swiper()?.update();
    swiper()?.slideTo(oldLength);
  };
  const handleRemoveForgotCards = () => {
    setWords(
      forgotWords.map((word) => word._id),
      (word) => ({ ...word, isForgot: false, showDefi: false })
    );
    setForgotWords([]);
  };

  const list = () => (isShowForgot() ? forgotWords : words);

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
              onBeforeSlideChangeStart={(s) => {
                if (s.isEnd) setIsLastSlide(true);
              }}
              grabCursor={true}
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
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => setSwiper(swiper)}
            >
              <For each={list()}>
                {(word, idx) => {
                  const handleFlip = (e: Event) => {
                    if (!isButton(e.target as HTMLElement)) {
                      if (isShowForgot())
                        setForgotWords([idx()], "showDefi", !word.showDefi);
                      else setWords([idx()], "showDefi", !word.showDefi);
                    }
                  };
                  const toggleForgotBtn = () => {
                    if (isShowForgot())
                      setForgotWords([idx()], "isForgot", !word.isForgot);
                    else setWords([idx()], "isForgot", !word.isForgot);
                  };
                  return (
                    <SwiperSlide>
                      <Card
                        word={word}
                        title={`${idx() + 1}/${
                          isShowForgot() ? forgotWords.length : dbSize()
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
              <p>Words you forgot: {forgotWords.length} words</p>
              <Show when={forgotWords.length > 0}>
                <ul>
                  <For each={forgotWords}>{(word) => <li>{word.text}</li>}</For>
                </ul>
                <button onClick={handleReviewForgot}>
                  Review forgotten cards
                </button>
                <button onClick={handleRemoveForgotCards}>
                  Remove all forgotten cards
                </button>
              </Show>
              <button onClick={handleNextRound}>Next round</button>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default FlashCardsPage;
