export const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

export const message = (level) => {
  if (level === "easy")
    return "Fantastic job!, let's tackle the medium-level !";
  if (level === "medium") return "Great job! On to the hard level!";
  return "Excellent work! You've completed the quiz.";
};
