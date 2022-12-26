import styles from "./FlashCards.module.scss";
import {
  Accessor,
  Component,
  createSignal,
  For,
  onMount,
  Setter,
} from "solid-js";
import { Swiper, SwiperSlide } from "swiper/solid";
import type { Swiper as SwiperRef } from "swiper";
import { Navigation, EffectCreative } from "swiper";
import Card from "../components/Card";

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
  const [swiper, setSwiper] = createSignal<SwiperRef | null>(null);
  let slider: HTMLDivElement;

  onMount(async () => {
    window.electronAPI.setTitle("Flash Cards");
    const result = await window.electronAPI.getData(20);

    setWords(
      result.map((word) => {
        const [showDefi, setShowDefi] = createSignal<boolean>(false);
        return { ...word, showDefi, setShowDefi };
      })
    );
  });
  const goNextCard = () => {
    swiper()?.slideNext();
  };
  const goPrevCard = () => {
    swiper()?.slidePrev();
  };

  return (
    <div class={styles.container}>
      <h2>Flash Cards</h2>
      <div class={styles.slider}>
        <div class={styles.slides} ref={(e) => (slider = e)}>
          <Swiper
            modules={[Navigation, EffectCreative]}
            navigation={{
              prevEl: null,
              nextEl: null,
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
            spaceBetween={30}
            slidesPerView={1}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => setSwiper(swiper)}
          >
            <For each={words()}>
              {(word, idx) => {
                const handleFlip = (e: Event) => {
                  if (!isButton(e.target as HTMLElement))
                    word.setShowDefi(!word.showDefi());
                };
                return (
                  <SwiperSlide>
                    <Card
                      word={word}
                      title={`${idx() + 1}/${words().length}`}
                      handleFlip={handleFlip}
                      goNextCard={goNextCard}
                      goPrevCard={goPrevCard}
                    />
                  </SwiperSlide>
                );
              }}
            </For>
            );
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default FlashCardsPage;
