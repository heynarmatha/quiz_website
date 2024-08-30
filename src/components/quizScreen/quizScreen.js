import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import star from "../../images/star.png";
import sadIcon from "../../images/sad.png";
import { message } from "../../utils/quizLogic";

const QuizScreen = ({ questions }) => {
  const pageTime = 30;
  const scoreDateCard = {
    currentLevel: "easy",
    currentScore: 0,
    levelScore: 0,
    nextLevel: false,
  };
  const levelData = localStorage.getItem("level");
  const savedTotalMark = localStorage.getItem("totalMark");
  const savedScoreCard = localStorage.getItem("scoreCard");
  const levelScoreValue = localStorage.getItem("levelScore");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalMark, setTotalMark] = useState(
    savedTotalMark ? JSON.parse(savedTotalMark) : 0
  );
  const [userAnswer, setUserAnswer] = useState("");
  const [levelScore, setLevelScore] = useState(
    levelScoreValue ? JSON.parse(levelScoreValue) : 0
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(pageTime);
  const [timerRunning, setTimerRunning] = useState(true);
  const [level, setLevel] = useState(
    levelData ? JSON.parse(levelData) : "easy"
  );
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [scoreCard, setScoreCard] = useState(
    savedScoreCard ? JSON.parse(savedScoreCard) : scoreDateCard
  );

  // Retrieve state from localStorage on component mount
  useEffect(() => {
    if (savedTotalMark) {
      setTotalMark(JSON.parse(savedTotalMark));
    }
    if (savedScoreCard) {
      setScoreCard(JSON.parse(savedScoreCard));
    }
    if (levelData) {
      setLevel(JSON.parse(levelData));
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("totalMark", JSON.stringify(totalMark));
  }, [totalMark]);

  useEffect(() => {
    localStorage.setItem("scoreCard", JSON.stringify(scoreCard));
  }, [scoreCard]);
  useEffect(() => {
    localStorage.setItem("level", JSON.stringify(level));
  }, [level]);
  useEffect(() => {
    localStorage.setItem("levelScore", JSON.stringify(levelScore));
  }, [levelScore]);

  const pageWait = () => {
    setTimeout(() => {
      setShowFeedback(false);
      setTimeLeft(pageTime);
      setTimerRunning(false);
      if (currentQuestionIndex <= questions[level].length - 1) {
        if (currentQuestionIndex < questions[level].length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setTimerRunning(true);
        } else if (currentQuestionIndex + 1 === questions[level].length) {
          setShowLevelComplete(true);
        }
      }
    }, 1000);
  };

  const scoreCalculation = (level, levelScoreval, score) => {
    if (currentQuestionIndex <= questions[level].length - 1) {
      const ratio = levelScoreval / (questions[level].length * score);
      const referenceRatio =
        ((questions[level].length - 1) * score) /
        (questions[level].length * score);
      const percentage = ratio * 100;
      const referencePercentage = referenceRatio * 100;

      if (percentage >= referencePercentage) {
        setScoreCard({
          ...scoreCard,
          nextLevel: true,
        });
      }
    }
  };

  useEffect(() => {
    if (timerRunning && currentQuestionIndex < questions[level].length) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowFeedback(true);
            setFeedbackMessage("TimeOut!");
            pageWait();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex]);

  const handleAnswerSubmit = () => {
    const currentQuestion = questions[level][currentQuestionIndex];
    const isCorrect =
      currentQuestion.correctAnswer.toLowerCase() === userAnswer.toLowerCase();

    if (isCorrect) {
      setFeedbackMessage("Correct");
      let addScore = level === "easy" ? 10 : level === "medium" ? 20 : 30;
      if (currentQuestionIndex <= questions[level].length - 1) {
        scoreCalculation(level, levelScore + addScore, addScore);
      }
      setLevelScore(levelScore + addScore);
      setTotalMark(totalMark + addScore);
      setShowFeedback(true);
      setUserAnswer("");
      pageWait();
    } else {
      setFeedbackMessage("Incorrect");
      setShowFeedback(true);
      setUserAnswer("");
      pageWait();
    }
  };

  const handleChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleRetest = () => {
    setCurrentQuestionIndex(0);
    setLevelScore(0);
    setShowLevelComplete(false);
    setTimerRunning(true);
    setTimeLeft(pageTime);
    setTotalMark(totalMark - levelScore);
  };

  const handleNextLevel = () => {
    let addLevel = scoreCard.currentLevel === "easy" ? "medium" : "hard";
    setScoreCard({ ...scoreCard, currentLevel: addLevel, nextLevel: false });
    setLevel(addLevel);
    setCurrentQuestionIndex(0);
    setLevelScore(0);
    setShowLevelComplete(false);
    setTimeLeft(pageTime);
    setTimerRunning(true);
    setShowFeedback(false);
  };
  const handleStartAgain = () => {
    setCurrentQuestionIndex(0);
    setShowLevelComplete(false);
    setTimeLeft(pageTime);
    setTimerRunning(true);
    setShowFeedback(false);
    setLevel("easy");
    setScoreCard(scoreDateCard);
    setTotalMark(0);
    setLevelScore(0);
  };

  return (
    <div className={styles.quizScreenContainer}>
      {!showLevelComplete ? (
        <div className={styles.questionsContainer}>
          <h3>{questions[level][currentQuestionIndex]?.question}</h3>
          {questions[level][currentQuestionIndex].type ===
            "multiple-choice" && (
            <div>
              {questions[level][currentQuestionIndex].options.map(
                (option, index) => (
                  <label key={index} className={styles.optionContainer}>
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      onChange={handleChange}
                      checked={userAnswer === option}
                    />
                    {option}
                  </label>
                )
              )}
            </div>
          )}
          {questions[level][currentQuestionIndex].type === "true-false" && (
            <div>
              <label className={styles.optionContainer}>
                <input
                  type="radio"
                  name="answer"
                  value="true"
                  onChange={handleChange}
                  checked={userAnswer === "true"}
                />
                True
              </label>
              <label className={styles.optionContainer}>
                <input
                  type="radio"
                  name="answer"
                  value="false"
                  onChange={handleChange}
                  checked={userAnswer === "false"}
                />
                False
              </label>
            </div>
          )}
          {questions[level][currentQuestionIndex].type === "text-input" && (
            <div className={styles.textInputContainer}>
              <input type="text" value={userAnswer} onChange={handleChange} />
            </div>
          )}
          <div>
            <div className={styles.timerContainer}>
              <p className={styles.timer}>Time Left: {timeLeft} S</p>
              {showFeedback && (
                <p
                  className={`${
                    feedbackMessage === "Correct"
                      ? styles.feedBackMessageSuccess
                      : styles.feedBackMessageError
                  }`}
                >
                  {feedbackMessage}
                </p>
              )}
            </div>
            <button
              className="buttonBlue"
              onClick={handleAnswerSubmit}
              style={{
                marginRight: "20px",
                backgroundColor:
                  userAnswer === "" ? "rgba(128, 128, 128, 0.826)" : "",
              }}
              disabled={userAnswer === ""}
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.successFullyEarn}>
          <div>
            {scoreCard.nextLevel ? (
              <div>
                <div>
                  <div className={styles.startSuccess}>
                    <img src={star} alt="star" style={{ width: "50px" }} />
                  </div>
                  <h5>Congratulations</h5>
                </div>
                {scoreCard.nextLevel && scoreCard?.currentLevel === "hard" ? (
                  <h5>Your Final Score : {totalMark}</h5>
                ) : (
                  <h5>Your Score : {levelScore}</h5>
                )}
                <h5>Level : {level}</h5>
                <h5>{message(level)}</h5>
              </div>
            ) : (
              <>
                <div className={styles.startSuccess}>
                  <img src={sadIcon} alt="sad" style={{ width: "50px" }} />
                </div>
                <h5>Tough luck</h5>
                <h5>Your Score : {levelScore}</h5>
                <h5>Level : {level}</h5>
                <h5>Didn't nail it this time, then go for a retake !</h5>
              </>
            )}
          </div>

          <div className={styles.buttonContainer}>
            {scoreCard.nextLevel && scoreCard?.currentLevel !== "hard" ? (
              <button className="buttonBlue" onClick={handleNextLevel}>
                Next Level
              </button>
            ) : (
              <>
                {scoreCard.nextLevel && scoreCard?.currentLevel === "hard" ? (
                  <button
                    className="buttonRed"
                    onClick={handleStartAgain}
                    style={{ marginRight: "20px" }}
                  >
                    Start Again
                  </button>
                ) : (
                  <button
                    className="buttonRed"
                    onClick={handleRetest}
                    style={{ marginRight: "20px" }}
                  >
                    Retake
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;
