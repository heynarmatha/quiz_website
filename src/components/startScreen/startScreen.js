import React from "react";
import styles from "./style.module.scss";

const StartScreen = ({ onStart }) => {
  return (
    <div className={styles.startScreenContainer}>
      <div className={styles.startScreenContainer}>
        <h1>Test your Knowledge</h1>
        <div style={{ padding: "0 10px" }}>
          <h5>
            <span>Easy level :</span> 10 points per correct answer.
          </h5>
          <h5>
            <span> Medium level : </span> 20 points per correct answer.
          </h5>
          <h5>
            <span>Hard level : </span> 30 points per correct answer.
          </h5>
        </div>
        <button onClick={onStart} className="buttonRed">
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
