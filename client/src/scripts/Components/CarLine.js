import { deleteCar, updateCar } from '../Controllers/car.controller';
import { engineStatus, startEngine, stopEngine } from '../Controllers/engine.controller';
import createCar from './Car';
import CarModal from './CarModal';
import '../../styles/Components/CarLine.scss';

export default class CarLine {
  constructor(car, parent, renderParent) {
    this.car = car;
    this.element = null;
    this.parent = parent;
    this.renderParent = renderParent;
    this.animation = null;

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    const carElement = document.createElement('div');
    carElement.classList.add('car');
    carElement.dataset.id = this.car.id;

    const carLineTemplate = `
        <div class="car__options">
        <div class="car__buttons">
        <button class="button buttonEdit">Edit</button> 
        <button class="button  buttonStart"><i class="fa-solid fa-play"></i></button>
        <button class="button  buttonEnd" disabled><i class="fa-solid fa-stop"></i></button>
        <button class="button buttonDelete garage__button--red" type="button" ><i class="fa-regular fa-trash-can"></i></button>
        <span class="car__name">${this.car.name}</span>
        </div>
        </div>
        <div class="car__container">
          ${createCar(this.car)}
        </div>
    `;

    carElement.insertAdjacentHTML('beforeend', carLineTemplate);
    this.element = carElement;
    this.parent.append(this.element);
  }

  bindEvents() {
    const editBtn = this.element.querySelector('.buttonEdit');
    const deleteBtn = this.element.querySelector('.buttonDelete');
    const startBtn = this.element.querySelector('.buttonStart');
    const stopBtn = this.element.querySelector('.buttonEnd');

    editBtn.addEventListener('click', () => {
      const carModal = new CarModal(this.car.id, this.car.name, this.car.color);
      carModal.init();

      carModal.onUpdate = async (name, color) => {
        const { error } = await updateCar(this.car.id, name, color);

        if (error) {
          alert(error);
          return;
        }

        this.renderParent();
      };
    });

    deleteBtn.addEventListener('click', async () => {
      const { error } = await deleteCar(this.car.id);

      if (error) {
        alert(error);
        return;
      }

      this.renderParent();
    });

    startBtn.addEventListener('click', async () => {
      try {
        await this.drive();
      } catch (error) {
        this.animation.pause();
      }
    });

    stopBtn.addEventListener('click', async () => {
      await this.stop();
    });
  }

  async drive() {
    const startBtn = this.element.querySelector('.buttonStart');
    const stopBtn = this.element.querySelector('.buttonEnd');

    const {
      error,
      result: { velocity, distance },
    } = await startEngine(this.car.id);

    if (error) {
      alert(error);
      return Promise.reject(error);
    }

    const carImg = this.element.querySelector('.car__img');
    const line = this.element.querySelector('.car__container').clientWidth;
    const time = distance / velocity; // in ms

    // disable buttons
    startBtn.disabled = true;
    stopBtn.disabled = false;

    this.animation = carImg.animate(
      [
        {
          transform: `translateX(${line}px)`,
        },
      ],
      {
        duration: time,
        fill: 'forwards',
      },
    );

    const { error: errorStatus } = await engineStatus(this.car.id);

    if (errorStatus) {
      this.animation.pause();
      return Promise.reject(errorStatus);
    }

    return Promise.resolve({ car: this.car, time: (time / 1000).toFixed(2) });
  }

  async stop() {
    this.animation.pause();
    const stopBtn = this.element.querySelector('.buttonEnd');
    const startBtn = this.element.querySelector('.buttonStart');

    const { error } = await stopEngine(this.car.id);

    if (error) {
      alert(error);
      return;
    }

    this.animation.cancel();
    this.animation = null;
    stopBtn.disabled = true;
    startBtn.disabled = false;
  }
}
