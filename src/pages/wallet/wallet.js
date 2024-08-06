// const openModalBtn = document.getElementById('open-modal-btn');
// const modalWindow = document.getElementById('modal-window');
// const withdrawForm = document.getElementById('withdraw-form');
// const withdrawBtn = document.getElementById('withdraw-btn');


// openModalBtn.addEventListener('click', () => {
//   modalWindow.style.display = 'block';
// });

// modalWindow.addEventListener('click', (e) => {
//   if (e.target === modalWindow) {
//     modalWindow.style.display = 'none';
//   }
// });

// withdrawForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const amount = document.getElementById('amount').value;
//   const wallet = document.getElementById('wallet').value;
//   const walletAddress = document.getElementById('wallet-address').value;

//   console.log(`Вывести средства: ${amount} на кошелек: ${wallet} с адресом: ${walletAddress}`);
// });


// document.getElementById('withdraw-btn').addEventListener('click', function() {

//   document.getElementById('amount').value = '';
//   document.getElementById('wallet').value = '';
//   document.getElementById('wallet-address').value = '';

//   document.getElementById('modal-window').style.display = 'none';;
// });


document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById('walletForm');
  const submitButton = document.getElementById('submitButton');

  submitButton.addEventListener('click', function() {
      const amount = document.getElementById('amount').value;
      const wallet = document.getElementById('wallet').value;
      const walletAddress = document.getElementById('wallet-address').value;

      const data = {
          amount: amount,
          wallet: wallet,
          walletAddress: walletAddress
      };

      fetch('https://aba-coin.web.app/save-wallet', {  // Замените URL на ваш сервер
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
          alert('Информация успешно сохранена!');
          form.reset();
      })
      .catch(error => {
          console.error('Ошибка:', error);
          alert('Произошла ошибка при сохранении информации.');
      });
  });
});
