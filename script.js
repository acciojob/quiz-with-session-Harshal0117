// Select the container where questions will be displayed
const questionsElement = document.getElementById("questions");
const submitButton = document.getElementById("submit");
const scoreElement = document.getElementById("score");

// Array of quiz questions
const questions = [
  { question: "What is the capital of France?", choices: ["Paris", "London", "Berlin", "Madrid"], answer: "Paris" },
  { question: "What is the highest mountain in the world?", choices: ["Everest", "Kilimanjaro", "Denali", "Matterhorn"], answer: "Everest" },
  { question: "What is the largest country by area?", choices: ["Russia", "China", "Canada", "United States"], answer: "Russia" },
  { question: "Which is the largest planet in our solar system?", choices: ["Earth", "Jupiter", "Mars"], answer: "Jupiter" },
  { question: "What is the capital of Canada?", choices: ["Toronto", "Montreal", "Vancouver", "Ottawa"], answer: "Ottawa" }
];

// Function to render quiz questions
function renderQuestions() {
  questionsElement.innerHTML = ""; // Clear previous questions
  let savedProgress = JSON.parse(sessionStorage.getItem("progress")) || {};

  questions.forEach((question, i) => {
    const questionContainer = document.createElement("div");
    questionContainer.innerHTML = `<p>${question.question}</p>`;

    question.choices.forEach((choice) => {
      const label = document.createElement("label");
      const choiceElement = document.createElement("input");
      choiceElement.type = "radio";
      choiceElement.name = `question-${i}`;
      choiceElement.value = choice;
      
      if (savedProgress[i] === choice) {
        choiceElement.checked = true;
      }
      
      choiceElement.addEventListener("change", () => {
        savedProgress[i] = choice;
        sessionStorage.setItem("progress", JSON.stringify(savedProgress));
      });
      
      label.appendChild(choiceElement);
      label.append(` ${choice}`);
      questionContainer.appendChild(label);
      questionContainer.appendChild(document.createElement("br"));
    });

    questionsElement.appendChild(questionContainer);
  });

  // Fix Cypress test issue: Ensure all checked radio buttons are applied after rendering
  setTimeout(() => {
    document.querySelectorAll("input[type='radio']").forEach((radio) => {
      let name = radio.name.split("-")[1];
      if (savedProgress[name] === radio.value) {
        radio.checked = true;
      }
    });
  }, 0);
}

// Function to calculate and display score
function submitQuiz() {
  let score = 0;
  let savedProgress = JSON.parse(sessionStorage.getItem("progress")) || {};

  questions.forEach((question, i) => {
    if (savedProgress[i] === question.answer) {
      score++;
    }
  });

  scoreElement.textContent = `Your score is ${score} out of ${questions.length}.`;
  localStorage.setItem("score", score);
}

// Load questions when page loads
renderQuestions();

// Add event listener to submit button
submitButton.addEventListener("click", submitQuiz);

// Display last stored score if available
const storedScore = localStorage.getItem("score");
if (storedScore !== null) {
  scoreElement.textContent = `Last score: ${storedScore} out of ${questions.length}.`;
}

