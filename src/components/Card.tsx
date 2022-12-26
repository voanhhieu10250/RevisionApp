import { Component } from "solid-js";
import styles from "./Card.module.scss";
import leftArrow from "../assets/left-arrow.svg";
import rightArrow from "../assets/right-arrow.svg";

export type CardType = Word & {
  showDefi: boolean;
  isForgot: boolean;
  _id: number;
};
type CardProps = {
  handleFlip: (e: Event) => void;
  goNextCard: () => void;
  goPrevCard: () => void;
  toggleForgotBtn: () => void;
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
        onClick={handleFlip}
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
              onClick={toggleForgotBtn}
            >
              {word.isForgot ? "I remembered" : "I forgot this one"}
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
              onClick={toggleForgotBtn}
            >
              {word.isForgot ? "I remembered" : "I forgot this one"}
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
