const $circle = document.querySelector('#circle');
const $score = document.querySelector('#score');
const $counter2 = document.querySelector('#counter2');

const user = Telegram.WebApp ? Telegram.WebApp.initDataUnsafe.user : null;
const username = user ? user.username || 'unknown' : 'unknown';


let dailyLimit = 1000;


function start() {
  fetchCounter();
  fetchDailyClicks();
  fetchTotalClicks();
}

function setScore(score) {
  localStorage.setItem('score', score);
  $score.textContent = score;
  updateCounter(score);
}

function getScore() {
  return Number(localStorage.getItem('score')) || 0;
}

function addOne() {
  const currentDailyClicks = getDailyClicks();
  const currentTotalClicks = getTotalClicks();
  if (currentDailyClicks < dailyLimit) {
    setScore(getScore() + 1);
    setDailyClicks(currentDailyClicks + 1);
    setTotalClicks(currentTotalClicks + 1);
  }
}

$circle.addEventListener('click', (event) => {
  if (getDailyClicks() >= dailyLimit) {
    console.log('click limit exceeded')
    return;
  } 


  const rect = $circle.getBoundingClientRect();

  const offsetX = event.clientX - rect.left - rect.width / 2;
  const offsetY = event.clientY - rect.top - rect.height / 2;

  const DEG = 40;

  const tiltX = (offsetY / rect.height) * DEG;
  const tiltY = (offsetX / rect.width) * -DEG;


  $circle.style.setProperty('--tiltX', `${tiltX}deg`);
  $circle.style.setProperty('--tiltY', `${tiltY}deg`);

  setTimeout(() => {
    $circle.style.setProperty('--tiltX', `0deg`);
    $circle.style.setProperty('--tiltY', `0deg`);
  }, 100);


  const plusOne = document.createElement('div');

  plusOne.classList.add('plus-one');
  plusOne.textContent = '+1';
  plusOne.style.left = `${event.clientX - rect.left}px`;
  plusOne.style.top = `${event.clientY - rect.top}px`;

  $circle.parentElement.appendChild(plusOne);

  addOne();

  setTimeout(() => {
    plusOne.remove();
  }, 2000);

  updateCounter2();
});

//for score
function fetchCounter() {
  fetch(`https://bony-dot-timer.glitch.me/counter/${username}`)
    .then(response => response.json())
    .then(data => {
      const score = data.counter || 0;
      localStorage.setItem('score', score);
      $score.textContent = score;
    })
    .catch(error => {
      console.error('Error fetching counter:', error);
    });
}

function updateCounter(score) {
  fetch('https://bony-dot-timer.glitch.me/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, counter: score })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Counter updated successfully:', data);
  })
  .catch(error => {
    console.error('Error updating counter:', error);
  });
}

//for today-amount(counter2)
function fetchDailyClicks() {
  fetch(`https://bony-dot-timer.glitch.me/daily-clicks/${username}`)
    .then(response => response.json())
    .then(data => {
      const dailyClicks = data.dailyClicks || 0;
      localStorage.setItem('dailyClicks', dailyClicks);
      updateCounter2();
    })
    .catch(error => {
      console.error('Error fetching daily clicks:', error);
    });
}

function getDailyClicks() {
  return Number(localStorage.getItem('dailyClicks')) || 0;
}

function setDailyClicks(clicks) {
  localStorage.setItem('dailyClicks', clicks);
  updateDailyClicksOnServer(clicks);
}

function updateDailyClicksOnServer(clicks) {
  fetch('https://bony-dot-timer.glitch.me/update-daily-clicks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, dailyClicks: clicks })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Daily clicks updated successfully:', data);
    })
    .catch(error => {
      console.error('Error updating daily clicks:', error);
    });
}

function updateCounter2() {
  $counter2.textContent = `${getDailyClicks()}/${dailyLimit}`;
}

//for totalscore
function fetchTotalClicks() {
  fetch(`https://bony-dot-timer.glitch.me/total-clicks/${username}`)
    .then(response => response.json())
    .then(data => {
      const totalClicks = data.totalClicks || 0;
      localStorage.setItem('totalClicks', totalClicks);
      updateCounter2();
    })
    .catch(error => {
      console.error('Error fetching daily clicks:', error);
    });
}

function getTotalClicks() {
  return Number(localStorage.getItem('totalClicks')) || 0;
}

function setTotalClicks(clicks) {
  localStorage.setItem('totalClicks', clicks);
  updateTotalClicksOnServer(clicks);
}

function updateTotalClicksOnServer(clicks) {
  fetch('https://bony-dot-timer.glitch.me/update-total-clicks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, totalClicks: clicks })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Total clicks updated successfully:', data);
    })
    .catch(error => {
      console.error('Error updating total clicks:', error);
    });
}


document.addEventListener('DOMContentLoaded', start);