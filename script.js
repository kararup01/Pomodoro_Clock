const timer = document.querySelector('.timer');
const title = document.querySelector('.title');
const startBtn = document.querySelector('.start-btn');
const pauseBtn = document.querySelector('.pause-btn');
const resumeBtn = document.querySelector('.resume-btn');
const resetBtn = document.querySelector('.reset-btn');
const pomoCountsDisplay = document.querySelector('.pomoCountsDisplay');

const WORK_TIME = 0.5*60;
const BREAK_TIME = 0.25*60; 
let timerId = null;
let oneRoundComplete = false;
let totalCount = 0;
let paused = false;

const updateTitle = (msg) =>{
  title.innerText = msg;
}

const saveLocalCount = () => {
  let counts = JSON.parse(localStorage.getItem("pomoCounts"));
  counts !== null ? counts++ : counts = 1;
  localStorage.setItem('pomoCounts', JSON.stringify(counts));
}

const countDown = (time) =>{
  return () => {
    const min = Math.floor(time/60).toString().padStart(2, '0');
    const sec = Math.floor(time%60).toString().padStart(2, '0');
    timer.innerText = `${min}:${sec}`;
    time--;
    if (time < 0){
      stopTimer();
      if(!oneRoundComplete){
        timerId = startTimer(BREAK_TIME);
        oneRoundComplete = true;
        updateTitle("It's break time!")
      } else {
        updateTitle(`Complete ${totalCount} round of pomodoro Technique!`)
        setTimeout(()=>updateTitle("Start timer again!"), 2000);
        totalCount++;
        saveLocalCount();
        showPomoCounts();
      }
    }
  }
}

const startTimer = (startTimer) =>{
  if (timerId != null){
    stopTimer();
  }
  return setInterval(countDown(startTimer), 1000);
}
const stopTimer = () =>{
  clearInterval(timerId);
  timerId = null;
}

const getTimeInSeconds = (timeString) => {
  let [minutes, seconds] = timeString.split(":");
  return parseInt(minutes*60) + parseInt(seconds)
}

startBtn.addEventListener('click', ()=>{
  timerId = startTimer(WORK_TIME);
  updateTitle("It's work time!")
})

pauseBtn.addEventListener('click', ()=>{
  stopTimer();
  paused = true;
  updateTitle("Timer Paused");
})

resumeBtn.addEventListener('click', ()=>{
  if(paused){
    const currentTime = getTimeInSeconds(timer.innerText);
    timerId = startTimer(currentTime);
    paused = false;
    (!oneRoundComplete) ? updateTitle("It's work time!") : updateTitle("It's break time");
  }
})

resetBtn.addEventListener('click', ()=>{
  stopTimer();
  timer.innerText = "55 : 00";
  updateTitle("Click start to start timer");
})

const showPomoCounts = () => {
  let counts = JSON.parse(localStorage.getItem("pomoCounts"));
  if(counts > 0){
    pomoCountsDisplay.style.display = "flex"
  }
  pomoCountsDisplay.firstElementChild.innerText = counts; 
}

showPomoCounts();