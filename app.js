/* global document, setInterval, clearInterval */
var startTime = null;
const secondsInMinute = 60;
const secondsInHour = 60 * 60;

var miliseconds = document.getElementById("miliseconds");
var seconds = document.getElementById("seconds");
var minutes = document.getElementById("minutes");
var action = document.getElementById("action");
var alarmSet = document.getElementById("alarm-set");
var reset = document.getElementById("reset");
var alarm = null;

action.addEventListener("click", onAction);
reset.addEventListener("click", onReset);
alarmSet.addEventListener("click", onChangeAlarm);

var interval = null;

var state = {
    start: "START",
    pause: "PAUSE",
    reset: "RESET"
}

function onAction(){
    if(interval){
        changeState(state.pause);
    } else {
        changeState(state.start);
    }
}

function onChangeAlarm(){
    alarm = minutesAlarm.value;
    console.log(alarm);
}

function onReset(){
    changeState(state.reset);
}

function changeState(st){
    switch (st) {
        case state.start:
            startTimer();
            break;
        case state.pause:
            stopTimer();
            break;
        case state.reset:
            stopTimer();
            resetTime();
            break;
        default:
            throw new Error("Unknown state")
    }
    updateActionButton();
}

function getString(n) {
    if (n < 10) {
        return "0" + String(n);
    } else {
        return String(n);
    }
}

function setTime(m, s) {
    minutes.innerText = getString(m);
    seconds.innerText = getString(s);

    if ( Number(minutes.innerText,10) == alarm ) {
        window.alert("FINISH!");
        console.log("FINISH!");
        onReset();
    }
}

function updateTime() {
    var diff = Math.floor((Date.now() - startTime) / 1000);
    var hours = Math.floor(diff / secondsInHour);
    diff = diff - hours * secondsInHour;
    var minutes = Math.floor(diff / secondsInMinute);
    diff = diff - minutes * secondsInMinute;
    var seconds = diff;

    setTime(minutes, seconds);
}

function getOffset(){
    var s = Number(seconds.innerText, 10);
    var m = Number(minutes.innerText, 10);
    var h = Number("0", 10);
    var offset = h*secondsInHour + m*secondsInMinute + s;
    var offsetInMs = offset * 1000;
    return offsetInMs;
}

function getStartTime() {
    var offset = getOffset();
    var now = Date.now();
    var sTime = now - offset;
    return sTime;
}

function resetTime(){
    seconds.innerHTML = "00";
    minutes.innerHTML = "00";
}

function startTimer() {
    startTime = getStartTime();
    interval = setInterval(updateTime, 100);
    reset.disabled = true;
}

function updateActionButton(){
    if (interval){
        action.innerText = "Pause";
    } else if (getOffset() > 0) {
        action.innerText = "Continue";
    } else {
        action.innerText = "Start";
    }
}

function stopTimer(){
    clearInterval(interval);
    interval = null;
    reset.disabled = false;
}

// include the ipc module to communicate with main process.
const ipcRenderer = require('electron').ipcRenderer;

let devList = ["Daphné", "Babacar", "Talla", "Sophie", "Mathieu", "Patrick", "Tamar", "Jake", "Étienne"];

const btnclick = document.getElementById('loadnewdev');
btnclick.addEventListener('click', function () {
  onReset();
  var i = Math.floor(Math.random()*devList.length);
  console.log(i);
  var arg = devList[i];
  devList.splice(i,1);
  console.log(arg);
  
  //send the info to main process . we can pass any arguments as second param.
  ipcRenderer.send("btnclick", arg); // ipcRender.send will pass the information to main process
});

const edilexToggle = document.getElementById("edilex-toggle");
// Stores the user's theme preference in local storage so it's persisted for next app launch.
const localTheme = localStorage.getItem("theme");
if (localTheme === "edilex") {
  document.body.classList.toggle("edilex");
  edilexToggle.setAttribute("checked", "true");
}

edilexToggle.addEventListener("change", () => {
  document.body.classList.toggle("edilex");
  const isToggledEdilex = document.body.classList.contains("edilex") ? true : false;

  const edilexLabel = document.getElementById("edilex-toggle-label");
  isToggledEdilex ? edilexLabel.innerText = "Switch to Default Mode" : edilexLabel.innerText = "Switch to Edilex Mode";

  localStorage.setItem("theme", isToggledEdilex ? "edilex" : "");
});

//ipcRenderer.on will receive the “btnclick-task-finished'” info from main process 
ipcRenderer.on('btnclick-task-finished', function(event,param) {
  console.log("received! " + param);
  if (param) {
    document.getElementById("message").innerHTML= param;
    document.getElementById("img").src = "imgs/" + param + ".png";            
  } else {
    document.getElementById("message").innerHTML= "fini!! bonne aprem ! ";
    document.getElementById("img").src = "imgs/doge.png";          
  }
});