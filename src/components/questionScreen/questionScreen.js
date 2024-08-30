import React, { useState, useEffect } from "react";
import { shuffleArray } from "../../utils/quizLogic";
import data from "../../data/questions.json";
import StartScreen from "../startScreen/startScreen";
import QuizScreen from "../quizScreen/quizScreen";
import styles from "./style.module.scss";
const QuestionScreen = () => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    const loadQuestions = () => {
      return {
        easy: shuffleArray(data.easy),
        medium: shuffleArray(data.medium),
        hard: shuffleArray(data.hard),
      };
    };
    setQuestions(loadQuestions());
  }, []);

  const handleStart = () => {
    setIsQuizStarted(true);
    // Clear all items in local storage
    localStorage.clear();
  };

  return (
    <div className={styles.questionScreen}>
      {!isQuizStarted ? (
        <StartScreen onStart={handleStart} />
      ) : questions ? (
        <QuizScreen questions={questions} />
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default QuestionScreen;
