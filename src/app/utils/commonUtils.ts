import questionnaireData from "@app/data/questionnaire-data.json";

export const fetchQuestions = () => {
  const chosenQuestions: string[] = [];

  questionnaireData.forEach((questionnaireDataObj) => {
    const categoryQuestionsArr = questionnaireDataObj.categoryQuestions;

    if (categoryQuestionsArr?.length) {
      const randomIndexForOne: number = Math.floor(
        Math.random() * categoryQuestionsArr?.length
      );

      chosenQuestions.push(categoryQuestionsArr[randomIndexForOne]);
    }
  });

  return chosenQuestions;
};
