let score = 0;
let timeRemaining = 300;
let timerInterval;
let playing = false;
let selectedQuestions = [];

const lengthValues = [1, 2, 3, 4, 5, 6];
const widthValues = [1, 2, 3, 4, 5, 6];
const heightValues = [2, 3, 5, 6, 8, 9];

let backgroundMusic = new Audio('Background.mp3'); 
backgroundMusic.loop = true; 
let isMusicPlaying = false; 


function toggleVolume() {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        document.getElementById("volume-button").innerText = "🔇 ";
    } else {
        backgroundMusic.play();
        document.getElementById("volume-button").innerText = "🔊 ";
    }
    isMusicPlaying = !isMusicPlaying;
}

document.getElementById("startreset").onclick = function() {
    if (playing) {
        location.reload();
    } else {
        playing = true;
        score = 0;
        clearInterval(timerInterval);
        generateQuestions();
        generateValues();
        startTimer();
        document.getElementById('score').innerText = `Score: ${score}`;
        document.getElementById("timeremaining").style.display = "block";
        document.getElementById('timeremainingvalue').innerHTML = timeRemaining;
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById("startreset").innerHTML = "Reset Game";
        document.getElementById("container").classList.remove("hidden");
        document.getElementById('start-image').classList.add('hidden');
        document.getElementById("volume-button").style.display = "block";
    }
};

function startTimer() {
    timerInterval = setInterval(function() {
        timeRemaining--;
        document.getElementById('timeremainingvalue').innerText = timeRemaining;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}

function generateQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';
    selectedQuestions = getRandomQuestions(5);
    selectedQuestions.forEach((q, index) => {
        const questionHTML = `
            <div style="margin: 20px; padding: 10px; border-radius: 10px;">
                2 × <span class="height" id="height${index}" ondrop="drop(event, 'height')" ondragover="allowDrop(event)">Drag Height here</span>
                × (<span class="length" id="length${index}" ondrop="drop(event, 'length')" ondragover="allowDrop(event)">Drag Length here</span>
                + <span class="width" id="width${index}" ondrop="drop(event, 'width')" ondragover="allowDrop(event)">Drag Width here</span>) =
                <span id="targetArea${index}" style="font-weight: bold;">${q.targetArea}</span>
                <button id="check-button" onclick="checkAnswer(${index})">Check Answer</button>
                <span id="result${index}" style="display: none;"></span>
            </div>
        `;
        container.innerHTML += questionHTML;
    });
}

function getRandomQuestions(num) {
    const questions = [
        { targetArea: '120 cm²' },
        { targetArea: '72 cm²' },
        { targetArea: '44 cm²' },
        { targetArea: '24 cm²' },
        { targetArea: '144 cm²' },
    ];
    
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

function generateValues() {
    const lengthValuesContainer = document.getElementById('length-values');
    lengthValuesContainer.innerHTML = `<tr><td style="text-align: left; font-weight: bold; font-size: 25px;">Set Length:</td></tr>`; 
    lengthValues.forEach(value => {
        const valueHTML = `
            <td><div draggable="true" ondragstart="drag(event)" id="length-${value}" data-type="length" style="background-color: lightpink; border: 2px solid #333; border-radius: 5px; padding: 10px; font-size: 20px; cursor: move;">${value} cm</div></td>
        `;
        lengthValuesContainer.innerHTML += valueHTML;
    });

    const widthValuesContainer = document.getElementById('width-values');
    widthValuesContainer.innerHTML = `<tr><td style="text-align: left; font-weight: bold; font-size: 25px;">Set Width:</td></tr>`;
    widthValues.forEach(value => {
        const valueHTML = `
            <td><div draggable="true" ondragstart="drag(event)" id="width-${value}" data-type="width" style="background-color: lightgrey; border: 2px solid #333; border-radius: 5px; padding: 10px; font-size: 20px; cursor: move;">${value} cm</div></td>
        `;
        widthValuesContainer.innerHTML += valueHTML;
    });

    const heightValuesContainer = document.getElementById('height-values');
    heightValuesContainer.innerHTML = `<tr><td style="text-align: left; font-weight: bold; font-size: 25px;">Set Height:</td></tr>`; 
    heightValues.forEach(value => {
        const valueHTML = `
            <td><div draggable="true" ondragstart="drag(event)" id="height-${value}" data-type="height" style="background-color: goldenrod; border: 2px solid #333; border-radius: 5px; padding: 10px; font-size: 20px; cursor: move;">${value} cm</div></td>
        `;
        heightValuesContainer.innerHTML += valueHTML;
    });
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
    event.dataTransfer.setData("type", event.target.getAttribute('data-type'));
}

function drop(event, dropType) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const type = event.dataTransfer.getData("type");

    if (type === dropType) {
        event.target.textContent = document.getElementById(data).textContent;
        event.target.setAttribute('data-value', document.getElementById(data).textContent);
    }
}

function checkAnswer(index) {
    const height = parseInt(document.getElementById(`height${index}`).innerText);
    const length = parseInt(document.getElementById(`length${index}`).innerText);
    const width = parseInt(document.getElementById(`width${index}`).innerText);
    const targetArea = selectedQuestions[index].targetArea;

    if (!isNaN(height) && !isNaN(length) && !isNaN(width)) {
        const calculatedArea = 2 * height * (length + width) + ' cm²';
        if (calculatedArea === targetArea) {
            document.getElementById('result').innerText = `Correct! The lateral surface area is ${calculatedArea}.☺️`;
            document.getElementById('result').style.color = 'green';
            document.getElementById('correctAnswerSound').play();
            updateScore(true); 
            document.getElementById(`result${index}`).innerText = 'Answered';
        } else {
            document.getElementById('result').innerText = `Incorrect. Try again.😓`;
            document.getElementById('result').style.color = 'red';
            document.getElementById('IncorrectAnswerSound').play();
            updateScore(false);
        }
    } else {
        document.getElementById('result').innerText = `Please drag and drop the correct values.`;
    }
}

function updateScore(isCorrect) {
    score += isCorrect ? 1 : -1;
    document.getElementById('score').innerText = `Score: ${score}`;
}

function gameOver() {
    clearInterval(timerInterval);
    backgroundMusic.pause(); 
    isMusicPlaying = false;
    document.getElementById("volume-button").innerText = "🔇 Volume Off"; 
    document.getElementById('timeremainingvalue').innerText = 'Game Over';
    document.getElementById('score').innerText = `Final Score: ${score}`;
    document.getElementById('gameOver').style.display = 'block';
}


