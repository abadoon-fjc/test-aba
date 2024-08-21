// modal-window for button "info"
const infoModal = document.getElementById("infoModal");
const infoButton = document.getElementById("info-button");
const closeButton = document.querySelector(".modal-info .close-info");


infoButton.onclick = function() {
    infoModal.style.display = "block";
}

closeButton.onclick = function() {
    infoModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == infoModal) {
        infoModal.style.display = "none";
    }
}



// modal-window for button "withdraw this money, bro"
const modal = document.getElementById("myModal");
const openModalButton = document.getElementById("openModalButton");
const closeModalSpan = document.getElementsByClassName("close")[0];

openModalButton.onclick = async function() {
    const user = Telegram.WebApp ? Telegram.WebApp.initDataUnsafe.user : null;
    const username = user ? user.username || 'unknown' : 'unknown';

    try {
        const response = await fetch(`https://bony-dot-timer.glitch.me/wallet-address/${username}`);
        if (response.ok) {
            const data = await response.json();
            const walletAddressField = document.getElementById('wallet-address');
            
            if (data.walletAddress) {
                walletAddressField.value = data.walletAddress;
            } else {
                walletAddressField.value = '';
            }
        } else {
            console.error('Ошибка при получении адреса кошелька');
        }
    } catch (error) {
        console.error('Ошибка при обращении к серверу:', error);
    }

    modal.style.display = "block";
};

closeModalSpan.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



// modal-window for button "connect wallet, bro"
const newModal = document.getElementById("newModal");
const openNewModalButton = document.getElementById("openNewModalButton");
const closeNewModalSpan = document.getElementsByClassName("close-new")[0];


openNewModalButton.onclick = function() {
    newModal.style.display = "block";
}

closeNewModalSpan.onclick = function() {
    newModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == newModal) {
        newModal.style.display = "none";
    }
}



//for server
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('walletForm');
    const submitButton = document.getElementById('submitButton');
    const newForm = document.getElementById('newWalletForm');
    const submitNewDataButton = document.getElementById('submitNewDataButton');

    submitButton.addEventListener('click', function() {
        const amount = parseInt(document.getElementById('amount').value);
        const wallet = document.getElementById('wallet').value;
        const walletAddress = document.getElementById('wallet-address').value;

    if (!amount || !wallet || !walletAddress) {
        alert('fill out all the fields, bro');
        return;
    }


    const user = Telegram.WebApp ? Telegram.WebApp.initDataUnsafe.user : null;
    const username = user ? user.username || 'unknown' : 'unknown';


    checkAndUpdateCounter(username, amount, wallet, walletAddress);
    });
    submitNewDataButton.addEventListener('click', function() {
        const newWallet = document.getElementById('new-wallet').value;
        const newWalletAddress = document.getElementById('new-wallet-address').value;

    if (!newWallet || !newWalletAddress) {
        alert('fill out all the fields, bro');
        return;
    }


    const user = Telegram.WebApp ? Telegram.WebApp.initDataUnsafe.user : null;
    const username = user ? user.username || 'unknown' : 'unknown';


    updateWalletDataInDatabase(username, newWallet, newWalletAddress);
    });
});

function checkAndUpdateCounter(username, amount, wallet, walletAddress) {
fetch(`https://bony-dot-timer.glitch.me/counter/${username}`)
    .then(response => response.json())
    .then(data => {
      const counter = data.counter || 0;

      if (amount <= counter) {
        fetch('https://bony-dot-timer.glitch.me/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, counter: counter - amount })
        })
            .then(response => response.json())
            .then(result => {
              console.log('Counter updated successfully:', result);
              updateWalletData(wallet, walletAddress, amount);
            })
            .catch(error => {
              console.error('Ошибка при обновлении счетчика:', error);
              alert('Some problems, bro. Try again, please!)');
            });
      } else {
        alert('You do not have that many ABA-coins, bro');
      }
    })
    .catch(error => {
      console.error('Ошибка при получении данных счетчика:', error);
      alert('Some problems, bro. Try again, please!)');
    });
}

function updateWalletData(wallet, walletAddress, amount) {
    const data = {
        amount: amount,
        wallet: wallet,
        walletAddress: walletAddress
    };

    console.log('Отправка данных на сервер:', data);


    fetch('https://long-spiffy-truck.glitch.me', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Результат:', result);
        alert('Data sent, bro! Wait for your ABA-coins!!');
        document.getElementById('walletForm').reset();
    })
    .catch(error => {
        console.error('Ошибка при сохранении информации о кошельке:', error);
        alert('Some problems, bro. Try again, please!)');
    });
}


function updateWalletDataInDatabase(username, wallet, walletAddress) {
    const data = {
        wallet: wallet,
        walletAddress: walletAddress
    };

    console.log('Отправка данных на сервер:', data);

    fetch('https://bony-dot-timer.glitch.me/update-wallet-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, ...data })
    })
    .then(response => response.json())
    .then(result => {
        console.log('Результат:', result);
        alert('Wallet connected successfully, bro!');
        document.getElementById('newWalletForm').reset();
        newModal.style.display = "none";
    })
    .catch(error => {
        console.error('Ошибка при обновлении данных кошелька:', error);
        alert('Some problems, bro. Try again, please!)');
    });
}