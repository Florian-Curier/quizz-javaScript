import "./style.css";
import { Questions } from "./questions.js";

const app = document.querySelector("#app");

const startButton = document.querySelector("#start");
startButton.addEventListener("click", startQuizz);

function startQuizz(event) {
  let currentQuestion = 0;
  let score = 0;

  displayQuestion(currentQuestion);

  function clean() {
    while (app.firstElementChild) {
      app.firstElementChild.remove();
    }
    const progress = getProgressBar(Questions.length, currentQuestion);
    app.appendChild(progress);
  }

  function displayQuestion(index) {
    clean();
    const question = Questions[index];
    if (!question) {
      displayFinishMessage();
      return;
    }

    const title = getTitleElement(question.question);
    app.appendChild(title);
    const answerDiv = createAnswer(question.answers);
    app.appendChild(answerDiv);

    const submittButton = getSubmittButton();

    submittButton.addEventListener("click", submitt);

    app.appendChild(submittButton);
  }

  function displayFinishMessage() {
    const h1 = document.createElement("h1");
    h1.innerText = "Bravo ! Tu as terminé le quiz";
    const p = document.createElement("p");
    p.innerText = `Tu as eu ${score} bonnes réponses sur ${Questions.length}`;

    app.appendChild(h1);
    app.appendChild(p);
  }

  function submitt() {
    const selectedAnswer = app.querySelector("input[name=answer]:checked");

    if (!selectedAnswer) {
      alert("Veuillez sélectionner une réponse.");
      return;
    }


    disableAllAnswers() 

    const value = selectedAnswer.value;
    const question = Questions[currentQuestion];

    const isCorrect = question.correct === value;

    if (isCorrect) {
      score++;
    }

    showFeedback(isCorrect, question.correct, value);
    const feedback = getFeedbackMessage(isCorrect, question.correct);
    app.appendChild(feedback);

    displayNextQuestionButton();    
  }

  function displayNextQuestionButton() {
    let TIMEOUT = 4000;
    let remainingTimeout = TIMEOUT;
    let timeout;  // Déclaration de la variable timeout
    let interval;

    document.querySelector("button").remove();



    const nextButton = document.createElement("button");
    nextButton.innerText = `Next (${remainingTimeout / 1000})`;

    app.appendChild(nextButton);

    interval = setInterval(() => {
      remainingTimeout -= 1000;
      nextButton.innerText = `Next (${remainingTimeout / 1000})`;

      if (remainingTimeout <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    // Déclaration de la fonction handleNextQuestion avant son utilisation
    const handleNextQuestion = () => {
        clearInterval(interval);
        clearTimeout(timeout);
        currentQuestion++;
        displayQuestion(currentQuestion);
    }

    // Utilisation de handleNextQuestion après la déclaration
    nextButton.addEventListener("click", () => {
      handleNextQuestion();
    });

    timeout = setTimeout(() => {
      handleNextQuestion();
    }, TIMEOUT);
}

  function getProgressBar(max, value) {
    const progress = document.createElement("progress");
    progress.setAttribute("max", max);
    progress.setAttribute("value", value);
    return progress;
  }

  function showFeedback(isCorrect, correct, answer) {
    const correctAnswerId = formatId(correct);
    const correctElement = document.querySelector(
      `label[for="${correctAnswerId}"]`
    );

    const selectedAnswerId = formatId(answer);
    const selectedElement = document.querySelector(
      `label[for="${selectedAnswerId}"]`
    );

    if (isCorrect) {
      selectedElement.classList.add("correct");
    } else {
      selectedElement.classList.add("incorrect");
      correctElement.classList.add("correct");
    }
  }

  function createAnswer(answers) {
    const answerDiv = document.createElement("div");

    answerDiv.classList.add("answers");

    for (const answer of answers) {
      const label = getAnswerElement(answer);
      answerDiv.appendChild(label);
    }

    return answerDiv;
  }
}

function getTitleElement(text) {
  const title = document.createElement("h3");
  title.innerText = text;
  return title;
}

function formatId(text) {
    return text.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();;
}

function getAnswerElement(text) {
  const label = document.createElement("label");
  label.innerText = text;
  const input = document.createElement("input");
  const id = formatId(text);
  input.id = id;
  label.htmlFor = id;
  input.setAttribute("type", "radio");
  input.setAttribute("name", "answer");
  input.setAttribute("value", text);
  label.appendChild(input);
  return label;
}

function getSubmittButton() {
  const submittButton = document.createElement("button");
  submittButton.innerText = "Submit";
  return submittButton;
}

function getFeedbackMessage(isCorrect, correct) {
  const paragraph = document.createElement("p");
  paragraph.innerText = isCorrect
    ? "Bravo tu as eu la bonne réponse"
    : `Dommage la bonne réponse était ${correct}`;

  return paragraph;
}

function disableAllAnswers() {
 const radioInputs = document.querySelectorAll('input[type="radio')

 for (const radio of radioInputs) {
    radioInputs.disabled = true
 }
}