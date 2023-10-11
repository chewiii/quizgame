const audio = document.getElementById("background-audio");
const volumeIcon = document.getElementById("volume-icon");

volumeIcon.addEventListener("click", toggleAudio);

function toggleAudio() {
    if (audio.paused) {
        audio.play();
        volumeIcon.classList.remove("fa-volume-mute");
        volumeIcon.classList.add("fa-volume-up");
    } else {
        audio.pause();
        volumeIcon.classList.remove("fa-volume-up");
        volumeIcon.classList.add("fa-volume-mute");
    }
}

let currentQuestionIndex = 0;
let quizType = "";
let selectedTimeLimit = 0; // Default time limit in seconds, can be changed based on the selected value
const timeLimitSelector = document.getElementById("time-limit");

// Set the initial selectedTimeLimit based on the default selected option
selectedTimeLimit = parseInt(timeLimitSelector.value);

timeLimitSelector.addEventListener("change", function () {
    selectedTimeLimit = parseInt(timeLimitSelector.value);
});

const imageElement = document.getElementById("image");
const scoreElement = document.getElementById("score");
const quizData = [
    {
        type: "multiple-choice",
        question: "What is the fastest land animal?",
        options: ["Cheetah", "Lion", "Giraffe"],
        correctAnswer: "Cheetah"
    },
    {
        type: "multiple-choice",
        question: "Which bird is known for its colorful plumage and is native to the Amazon Rainforest?",
        options: ["Eagle", "Penguin", "Macaw"],
        correctAnswer: "Macaw"
    },
    {
        type: "multiple-choice",
        question: "Which animal is a marsupial and native to Australia?",
        options: ["Kangaroo", "Polar Bear", "Giraffe"],
        correctAnswer: "Kangaroo"
    },
    {
        type: "multiple-choice",
        question: "What is the largest species of shark?",
        options: ["Great White Shark", "Tiger Shark", "Whale Shark"],
        correctAnswer: "Whale Shark"
    },
    {
        type: "multiple-choice",
        question: "Which of the following is not a big cat species?",
        options: ["Lion", "Tiger", "Cheetah"],
        correctAnswer: "Cheetah"
    },
    // Additional True/False Questions
    {
        type: "true-false",
        question: "All penguins live in the Arctic.",
        correctAnswer: "False"
    },
    {
        type: "true-false",
        question: "Polar bears are native to Antarctica.",
        correctAnswer: "False"
    },
    {
        type: "true-false",
        question: "Koalas are marsupials.",
        correctAnswer: "True"
    },
    {
        type: "true-false",
        question: "Gorillas are herbivores.",
        correctAnswer: "True"
    },
    {
        type: "true-false",
        question: "Snakes are classified as mammals.",
        correctAnswer: "False"
    },
    {
        type: "identification",
        question: "What is the largest land animal on Earth?",
        correctAnswer: "African Elephant"
    },
    {
        type: "identification",
        question: "Which bird is known for its long neck and is native to Africa?",
        correctAnswer: "Ostrich"
    },
    {
        type: "identification",
        question: "What is the national symbol of the United States, known for its bald head and strong beak?",
        correctAnswer: "Bald Eagle"
    },
    {
        type: "identification",
        question: "Which big cat is famous for its black fur and is native to the rainforests of Southeast Asia?",
        correctAnswer: "Black Panther"
    },
    {
        type: "identification",
        question: "What is the largest species of penguin, native to Antarctica?",
        correctAnswer: "Emperor Penguin"
    },
    // Add more questions in a similar format
];

let timer;
let timeRemaining = selectedTimeLimit; // 10 seconds per question
let score = 0;

function startQuiz() {
    const quizTypeSelector = document.getElementById("quiz-type");
    quizType = quizTypeSelector.value;
    currentQuestionIndex = 0;
    score = 0;

    // Filter the questions based on the selected quiz type
    const filteredQuestions = quizData.filter(question => question.type === quizType);
    if (filteredQuestions.length === 0) {
        document.getElementById("result").textContent = "No questions of this type available.";
        return;
    }

    quizData.length = 0; // Clear the original quizData array
    quizData.push(...filteredQuestions);

    showQuestion();
    timer = setInterval(updateTimer, 1000);
}

function showQuestion() {
    const quizContainer = document.getElementById("start-screen");
    quizContainer.style.display = "none";
    const quiz = document.getElementById("quiz");
    quiz.style.display = "block";

    const questionElement = document.getElementById("question");
    const currentQuestion = quizData[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    const correctAnswerElement = document.getElementById("correct-answer");
    correctAnswerElement.style.display = "none"; // Hide the correct answer initially
    correctAnswerElement.textContent = `Correct Answer: ${currentQuestion.correctAnswer}`;

    const resultElement = document.getElementById("result");
    resultElement.textContent = ""; // Clear previous result text

    const optionsElement = document.getElementById("options");
    optionsElement.innerHTML = "";

    if (currentQuestion.type === "multiple-choice") {
        const options = currentQuestion.options;
        for (let i = 0; i < options.length; i++) {
            const optionLabel = document.createElement("label");
            const optionRadio = document.createElement("input");
            optionRadio.type = "radio";
            optionRadio.name = "options";
            optionRadio.value = options[i];
            optionLabel.appendChild(optionRadio);
            optionLabel.appendChild(document.createTextNode(options[i]));
            optionsElement.appendChild(optionLabel);
        }
    } else if (currentQuestion.type === "true-false") {
        const trueFalseElement = document.createElement("div");
        trueFalseElement.innerHTML = `
            <label>
                <input type="radio" name="options" value="True"> True
            </label>
            <label>
                <input type="radio" name="options" value="False"> False
            </label>
        `;
        optionsElement.appendChild(trueFalseElement);
    } else if (currentQuestion.type === "identification") {
        const identificationInput = document.createElement("input");
        identificationInput.type = "text";
        identificationInput.id = "identification-input";
        optionsElement.appendChild(identificationInput);
    }

    // Show the "Submit" button
    const submitButton = document.getElementById("submit-button");
    submitButton.style.display = "block";

    // Hide the "Next" button
    const nextButton = document.getElementById("next-button");
    nextButton.style.display = "none";
}

function checkAnswer() {
    let selectedValue = null;
    const selectedOption = document.querySelector('input[name="options"]:checked');

    if (selectedOption) {
        selectedValue = selectedOption.value;
        selectedOption.classList.remove("correct-answer", "incorrect-answer"); // Remove previous classes
    }

    if (quizType === "identification") {
        const identificationInput = document.getElementById("identification-input");
        selectedValue = identificationInput.value;
    } else {
        const selectedOption = document.querySelector('input[name="options"]:checked');
        if (!selectedOption) {
            submitButton.disabled = true;
            return; // No option selected
        }
        selectedValue = selectedOption.value;
    }

    const correctAnswer = quizData[currentQuestionIndex].correctAnswer; // Single correct answer
    const resultElement = document.getElementById("result");
    const correctAnswerElement = document.getElementById("correct-answer");

    if (selectedValue && selectedValue.toLowerCase() === correctAnswer.toLowerCase()) {
        score++;
        updateScore();
        if (selectedOption) {
            selectedOption.classList.add("correct-answer"); // Add the correct-answer class
        }
    } else {
        correctAnswerElement.style.display = "block";
        if (selectedOption) {
            selectedOption.classList.add("incorrect-answer"); // Add the incorrect-answer class
        }
    }

    // Hide the "Submit" button
    const submitButton = document.getElementById("submit-button");
    submitButton.style.display = "none";

    // Show the "Next" button
    const nextButton = document.getElementById("next-button");
    nextButton.style.display = "block";
}

function nextQuestion() {
    quizSubmitted = false;
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        showQuestion();
        resetTimer();
    } else {
        clearInterval(timer);
        const correctAnswerElement = document.getElementById("correct-answer");
        correctAnswerElement.style.display = "none";

        document.getElementById("options").style.display = "none";
        document.getElementById("image").style.display = "none";

        const resultElement = document.getElementById("result");
        document.getElementById("question").style.display = "none";
        document.getElementById("score").style.display = "none";

        resultElement.textContent = `Quiz completed! Your score is ${score}/${quizData.length}`;
        document.getElementById("next-button").style.display = "none";
        document.getElementById("submit-button").style.display = "none";
    }
}

function updateScore() {
    const scoreValueElement = document.getElementById("score-value");
    scoreValueElement.textContent = score;
}

let quizSubmitted = false; // Variable to track if the quiz has been submitted

function updateTimer() {
    if (quizSubmitted) {
        return; // Do not update the timer if the quiz has been submitted
    }

    const timeElement = document.getElementById("time");
    timeElement.textContent = `${timeRemaining}s`;

    if (timeRemaining <= 0) {
        clearInterval(timer);

        // Check if there is a selected answer
        const selectedOption = document.querySelector('input[name="options"]:checked');
        const resultElement = document.getElementById("result");

        if (selectedOption) {
            const selectedValue = selectedOption.value;
            const correctAnswer = quizData[currentQuestionIndex].correctAnswer; // Single correct answer

            if (selectedValue.toLowerCase() === correctAnswer.toLowerCase()) {
                score++;
                updateScore();
                resultElement.textContent = "Time's up! Correct!";
                selectedOption.classList.add("correct-answer");

            } else {
                resultElement.textContent = `Time's up! Incorrect. Correct Answer: ${correctAnswer}`;
                selectedOption.classList.add("incorrect-answer");
            }
        } else {
            const correctAnswer = quizData[currentQuestionIndex].correctAnswer;
            resultElement.textContent = `Time's up! Correct Answer: ${correctAnswer}`;
        }

        // Show the "Next" button
        const nextButton = document.getElementById("next-button");
        nextButton.style.display = "block";

        // Remove the "Submit" button
        const submitButton = document.getElementById("submit-button");
        submitButton.style.display = "none";
    }

    timeRemaining--;
}

function resetTimer() {
    clearInterval(timer);
    timeRemaining = selectedTimeLimit;
    timer = setInterval(updateTimer, 1000);
}

function resetQuiz() {
    location.reload(); // Reload the page to reset the quiz
}

function submitQuiz() {
    checkAnswer();
    quizSubmitted = true; // Set the quizSubmitted flag to true
}
