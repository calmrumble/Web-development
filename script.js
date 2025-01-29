document.getElementById('contactBtn').addEventListener('click', function() {
    alert('Thank you for your interest! This is a demo alert message.');
}); 

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Reset previous error states
    clearErrors();
    
    let isValid = true;
    
    // Name validation
    if (name.length < 2) {
        showError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Email validation
    if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Message validation
    if (message.length < 10) {
        showError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    if (isValid) {
        alert(`Form Submitted Successfully!\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
        this.reset();
    }
});

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
    field.classList.add('error');
}

function clearErrors() {
    // Remove all error messages
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    // Remove error styling from inputs
    document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
}

class TodoList {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.todoInput = document.getElementById('todoInput');
        this.todoList = document.getElementById('todoList');
        this.addButton = document.getElementById('addTodo');
        
        this.initialize();
        this.renderTodos();
    }

    initialize() {
        // Add task button click handler
        this.addButton.addEventListener('click', () => this.addTodo());
        
        // Enter key handler
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (text) {
            const todo = {
                id: Date.now(),
                text: text,
                completed: false
            };
            
            this.todos.push(todo);
            this.saveTodos();
            this.renderTodos();
            this.todoInput.value = '';
        }
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        this.saveTodos();
        this.renderTodos();
    }

    deleteTodo(id) {
        const todoElement = document.querySelector(`[data-id="${id}"]`);
        todoElement.style.animation = 'fadeOut 0.3s ease-out';
        
        todoElement.addEventListener('animationend', () => {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.saveTodos();
            this.renderTodos();
        });
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    renderTodos() {
        this.todoList.innerHTML = '';
        this.todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.dataset.id = todo.id;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
            
            const text = document.createElement('span');
            text.textContent = todo.text;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '×';
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
            
            li.appendChild(checkbox);
            li.appendChild(text);
            li.appendChild(deleteBtn);
            this.todoList.appendChild(li);
        });
    }
}

class Quiz {
    constructor() {
        this.questions = [
            {
                question: "What is JavaScript?",
                options: [
                    "A programming language",
                    "A markup language",
                    "A styling language",
                    "An operating system"
                ],
                correct: 0
            },
            {
                question: "Which of these is NOT a JavaScript data type?",
                options: [
                    "String",
                    "Boolean",
                    "Integer",
                    "Object"
                ],
                correct: 2
            },
            {
                question: "What does DOM stand for?",
                options: [
                    "Document Object Model",
                    "Data Object Model",
                    "Document Oriented Model",
                    "Digital Object Model"
                ],
                correct: 0
            },
            {
                question: "Which operator is used for strict equality comparison?",
                options: [
                    "==",
                    "===",
                    "=",
                    "!="
                ],
                correct: 1
            },
            {
                question: "What is the correct way to declare a variable in modern JavaScript?",
                options: [
                    "var x = 5",
                    "const x = 5",
                    "let x = 5",
                    "Both B and C"
                ],
                correct: 3
            }
        ];
        
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedOption = null;
        
        // Add console logs for debugging
        console.log('Quiz initialized');
        this.initialize();
    }

    initialize() {
        // Get DOM elements
        this.questionContainer = document.getElementById('question-container');
        this.optionsContainer = document.getElementById('options-container');
        this.submitButton = document.getElementById('submit-answer');
        this.nextButton = document.getElementById('next-question');
        this.resultContainer = document.getElementById('quiz-result');
        
        // Debug log
        console.log('Elements found:', {
            questionContainer: this.questionContainer,
            optionsContainer: this.optionsContainer,
            submitButton: this.submitButton,
            nextButton: this.nextButton,
            resultContainer: this.resultContainer
        });

        // Add event listeners
        if (this.submitButton) {
            this.submitButton.addEventListener('click', () => this.checkAnswer());
        }
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextQuestion());
        }
        
        // Load first question
        this.loadQuestion();
        this.updateProgress();
    }

    loadQuestion() {
        if (!this.questionContainer || !this.optionsContainer) {
            console.error('Quiz containers not found');
            return;
        }

        const question = this.questions[this.currentQuestion];
        console.log('Loading question:', question);

        // Clear previous content
        this.questionContainer.innerHTML = '';
        this.optionsContainer.innerHTML = '';
        if (this.resultContainer) {
            this.resultContainer.textContent = '';
        }

        // Add question text
        const questionText = document.createElement('p');
        questionText.textContent = question.question;
        this.questionContainer.appendChild(questionText);

        // Add options
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option fade-in';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.selectOption(index, optionElement));
            this.optionsContainer.appendChild(optionElement);
        });

        // Show/hide buttons
        if (this.submitButton) this.submitButton.style.display = 'block';
        if (this.nextButton) this.nextButton.style.display = 'none';

        console.log('Question loaded successfully');
    }

    selectOption(index, element) {
        const options = this.optionsContainer.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected'));
        element.classList.add('selected');
        this.selectedOption = index;
    }

    checkAnswer() {
        if (this.selectedOption === null) {
            this.resultContainer.textContent = 'Please select an answer!';
            return;
        }

        const correct = this.questions[this.currentQuestion].correct;
        const options = this.optionsContainer.querySelectorAll('.option');
        
        options[correct].classList.add('correct');
        if (this.selectedOption !== correct) {
            options[this.selectedOption].classList.add('incorrect');
        } else {
            this.score++;
        }
        
        this.submitButton.style.display = 'none';
        this.nextButton.style.display = 'block';
        
        if (this.currentQuestion === this.questions.length - 1) {
            this.nextButton.textContent = 'Show Results';
        }
    }

    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            this.loadQuestion();
            this.updateProgress();
        } else {
            this.showResults();
        }
    }

    updateProgress() {
        document.getElementById('current-question').textContent = this.currentQuestion + 1;
        document.getElementById('total-questions').textContent = this.questions.length;
    }

    showResults() {
        const percentage = (this.score / this.questions.length) * 100;
        this.questionContainer.innerHTML = '<h2>Quiz Complete!</h2>';
        this.optionsContainer.innerHTML = '';
        this.resultContainer.innerHTML = `
            <p>Your score: ${this.score} out of ${this.questions.length}</p>
            <p>Percentage: ${percentage}%</p>
            <button onclick="new Quiz()" class="quiz-button">Try Again</button>
        `;
        this.nextButton.style.display = 'none';
    }
}

class JokeGenerator {
    constructor() {
        this.jokeText = document.getElementById('joke-text');
        this.fetchButton = document.getElementById('fetch-joke');
        this.loadingSpinner = document.getElementById('joke-loading');
        
        this.fetchButton.addEventListener('click', () => this.fetchJoke());
        
        // Fetch initial joke
        this.fetchJoke();
    }
    
    async fetchJoke() {
        try {
            // Disable button and show loading
            this.fetchButton.disabled = true;
            this.loadingSpinner.style.display = 'block';
            this.jokeText.textContent = 'Loading...';
            
            const response = await fetch('https://v2.jokeapi.dev/joke/Programming?safe-mode&type=single');
            const data = await response.json();
            
            // Add fade-in effect
            this.jokeText.classList.remove('fade-in');
            void this.jokeText.offsetWidth; // Trigger reflow
            this.jokeText.classList.add('fade-in');
            
            // Display the joke
            if (data.type === 'single') {
                this.jokeText.textContent = data.joke;
            } else {
                this.jokeText.textContent = 'Could not load joke. Please try again.';
            }
            
        } catch (error) {
            console.error('Error fetching joke:', error);
            this.jokeText.textContent = 'Failed to load joke. Please try again.';
        } finally {
            // Re-enable button and hide loading
            this.fetchButton.disabled = false;
            this.loadingSpinner.style.display = 'none';
        }
    }
}

// Initialize both Quiz and JokeGenerator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing components');
    new Quiz();
    new JokeGenerator();
}); 