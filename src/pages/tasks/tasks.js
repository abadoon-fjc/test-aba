const scrollContainer = document.querySelector('.scroll-container');
const scrollContent = document.querySelector('.scroll-content');


for (let i = 0; i < 3; i++) {
  const windowHTML = `
    <div class="window">
      <h2>Window ${i + 1}</h2>
      <button>Click me!</button>
    </div>
  `;
  scrollContent.innerHTML += windowHTML;
}

