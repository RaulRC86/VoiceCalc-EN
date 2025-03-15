const display = document.querySelector('#display');

function appendToDisplay(input) {
  display.value += input;
}

function clearDisplay() {
  display.value = '';
}

function calculate() {
  try {
    display.value = eval(display.value);
  } catch (err) {
    display.value = "Error";
  }
}


let isRecognizing = false;
let recognition;


function startVoiceRecognition() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Your browser does not support speech recognition.");
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.continuous = true; 
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onstart = function () {
    isRecognizing = true;
    display.value = "Listening...";
    toggleButtons(true); 
  };

  recognition.onresult = function (event) {
    const result = event.results[event.results.length - 1][0].transcript; 
    const parsedResult = parseSpeechToMath(result);
    
  
    display.value = parsedResult;


    try {
      const calcResult = eval(parsedResult);
      if (!isNaN(calcResult)) {
        display.value = calcResult;
      }
    } catch (err) {
     
    }
  };

  recognition.onerror = function (event) {
    display.value = "Error at speech recognition: " + event.error;
  };

  recognition.onend = function () {
    if (isRecognizing) {
      recognition.start(); 
    } else {
      display.value = "Recognition stopped";
      toggleButtons(false); 
    }
  };

  recognition.start();
}


function stopVoiceRecognition() {
  if (isRecognizing && recognition) {
    isRecognizing = false;
    recognition.stop();
  }
}


function parseSpeechToMath(speech) {
  return speech
    .toLowerCase()
    .replace(/plus/g, "+")
    .replace(/minus/g, "-")
    .replace(/times/g, "*")
    .replace(/divided by/g, "/")
    .replace(/point/g, ".")
    .replace(/\s/g, ""); 
}


function toggleButtons(isActive) {
  const startButton = document.querySelector("#voiceStartButton");
  const stopButton = document.querySelector("#voiceStopButton");
  startButton.disabled = isActive;
  stopButton.disabled = !isActive;
}


document.addEventListener("DOMContentLoaded", () => {
  const calculator = document.getElementById("calculator");


  const voiceStartButton = document.createElement("button");
  voiceStartButton.id = "voiceStartButton";
  voiceStartButton.innerText = "🎤 Start ";
  voiceStartButton.onclick = startVoiceRecognition;

  // Botón para detener
  const voiceStopButton = document.createElement("button");
  voiceStopButton.id = "voiceStopButton";
  voiceStopButton.innerText = "🛑 Stop";
  voiceStopButton.onclick = stopVoiceRecognition;
  voiceStopButton.disabled = true; // Deshabilitado inicialmente

  calculator.appendChild(voiceStartButton);
  calculator.appendChild(voiceStopButton);
});