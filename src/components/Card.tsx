import { Component, Show } from "solid-js";
import styles from "./Card.module.scss";
import leftArrow from "../assets/left-arrow.svg";
import rightArrow from "../assets/right-arrow.svg";
import saveList from "../assets/save-list.svg";
import saveListBg from "../assets/save-list-bg.svg";

export type CardType = Word & {
  showDefi: boolean;
  isForgot: boolean;
  _id: number;
};
type CardProps = {
  handleFlip: (word: CardType, e: Event) => void;
  toggleForgotBtn: (word: CardType) => void;
  goNextCard: () => void;
  goPrevCard: () => void;
  title: string;
  word: CardType;
};
const Card: Component<CardProps> = ({
  handleFlip,
  toggleForgotBtn,
  title,
  word,
  goNextCard,
  goPrevCard,
}) => {
  return (
    <div class={styles.flipCard}>
      <div
        classList={{
          [styles.card]: true,
          [styles.rotateCard]: word.showDefi,
        }}
        onClick={[handleFlip, word]}
      >
        <div class={styles.cardInnerFront}>
          {/* card head */}
          <div class={styles.cardHeader}>
            <small>{title}</small>
            <button class={styles.edit}>Edit</button>
          </div>
          {/* card body */}
          <div class={styles.cardBody}>
            <p>{word.text}</p>
          </div>
          {/* card food */}
          <div class={styles.cardFooder}>
            <button onClick={goPrevCard}>
              <img src={leftArrow} alt="Go back" />
            </button>
            <button
              classList={{ [styles.forgotActive]: word.isForgot }}
              onClick={[toggleForgotBtn, word]}
              title="Didn't remember this word? Save it to review later"
            >
              <Show
                when={word.isForgot}
                fallback={<img src={saveList} alt="Save to review later" />}
              >
                <img src={saveListBg} alt="Unsave from review later list" />
              </Show>
            </button>
            <button onClick={goNextCard}>
              <img src={rightArrow} alt="Go next" />
            </button>
          </div>
        </div>

        <div class={styles.cardInnerBack}>
          {/* card head */}
          <div class={styles.cardHeader}>
            <small>{title}</small>
            <button class={styles.edit}>Edit</button>
          </div>
          {/* card body */}
          <div class={styles.cardBody}>
            <p>{word.definition}</p>
          </div>
          {/* card food */}
          <div class={styles.cardFooder}>
            <button onClick={goPrevCard}>
              <img src={leftArrow} alt="Go back" />
            </button>
            <button
              classList={{ [styles.forgotActive]: word.isForgot }}
              onClick={[toggleForgotBtn, word]}
              title="Didn't remember this word? Save it to review later"
            >
              <Show
                when={word.isForgot}
                fallback={<img src={saveList} alt="Save to review later" />}
              >
                <img src={saveListBg} alt="Unsave from review later list" />
              </Show>
            </button>
            <button onClick={goNextCard}>
              <img src={rightArrow} alt="Go next" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
