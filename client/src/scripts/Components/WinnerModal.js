import createCar from './Car';
import '../../styles/Components/Modal.scss';

const winnerModal = {
  show({ car, time }) {
    const body = document.querySelector('body');
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.classList.add('modal--winner');
    modal.innerHTML = `
      <div class="modal__content">
        <h2 class="modal__title">Winner</h2>
          ${createCar(car)}
          <h2>${car.name}</h2>
          <h3>${time}</h3>
      </div>
    `;
    body.append(modal);

    setTimeout(() => {
      modal.remove();
    }, 3000);
  },
};

export default winnerModal;
