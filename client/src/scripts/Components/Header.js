import winners from '../Pages/Winners';
import '../../styles/Components/Header.scss';

const headerElement = document.querySelector('.header');
const garageElement = document.querySelector('.garage');
const winnersElement = document.querySelector('.winners');

const header = {
  init() {
    this.render();
    this.bindEvents();
  },

  render() {
    headerElement.innerHTML = `
    <div class="header__title">Async Race</div>
    <div class="header__buttons">
    <button class="header__button" data-page="garage">Garage</button>
    <button class="header__button" data-page="winners">Winners</button>
    </div>
    `;
  },

  bindEvents() {
    const buttons = headerElement.querySelectorAll('.header__button');
    buttons.forEach((button) => {
      button.addEventListener('click', this.onButtonClick.bind(this));
    });
  },

  showPage(page) {
    if (page === 'garage') {
      winnersElement.classList.add('hidden');
      garageElement.classList.remove('hidden');
    } else if (page === 'winners') {
      garageElement.classList.add('hidden');
      winnersElement.classList.remove('hidden');
    }
  },

  reRenderPage(page) {
    if (page === 'winners') {
      winners.renderContent();
    }
  },

  onButtonClick(event) {
    const { page } = event.target.dataset;
    this.showPage(page);
    this.reRenderPage(page);
  },
};

export default header;
