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

    this.editBtn = this.element.querySelector('.buttonEdit');
    this.deleteBtn = this.element.querySelector('.buttonDelete');
    this.startBtn = this.element.querySelector('.buttonStart');
    this.stopBtn = this.element.querySelector('.buttonEnd');
    this.carImg = this.element.querySelector('.car__img');
    this.line = this.element.querySelector('.car__container');
  }

  bindEvents() {
    this.editBtn.addEventListener('click', () => {
      const carModal = new CarModal(this.car.id, this.car.name, this.car.color);
      carModal.onSubmit = async (name, color) => {
        const { error } = await updateCar(this.car.id, name, color);

        if (error) {
          alert(error);
          return;
        }

        this.renderParent();
      };

      carModal.init();
    });

    this.deleteBtn.addEventListener('click', async () => {
      const { error } = await deleteCar(this.car.id);

      if (error) {
        alert(error);
        return;
      }

      this.renderParent();
    });

    this.startBtn.addEventListener('click', async () => {
      try {
        await this.drive();
      } catch (error) {
        this.animation?.pause();
      }
    });

    this.stopBtn.addEventListener('click', async () => {
      await this.stop();
    });
  }

  async drive() {
    if (!this.engineStatus && !this.animation && !this.startEngine) {
      this.time = 0;
      this.startBtn.disabled = true;
      this.deleteBtn.disabled = true;
      this.editBtn.disabled = true;
      this.startEngine = startEngine(this.car.id);

      const {
        error,
        result: { velocity, distance },
      } = await this.startEngine;

      this.animate(velocity, distance);

      if (error) {
        alert(error);
        return Promise.reject(error);
      }

      this.stopBtn.disabled = false;
      this.engineStatus = engineStatus(this.car.id);
    }

    if (this.startEngine && !this.engineStatus) await this.startEngine;

    const { error: errorStatus, result: resultStatus } = await this.engineStatus;

    this.engineStatus = null;
    this.startEngine = null;
    this.deleteBtn.disabled = false;
    this.editBtn.disabled = false;

    if (errorStatus || resultStatus === 'stopped') {
      this.animation.pause();
      return Promise.reject(errorStatus);
    }

    return Promise.resolve({ car: this.car, time: (this.time / 1000).toFixed(2) });
  }

  async stop() {
    this.animation?.pause();

    const { error } = await stopEngine(this.car.id);

    if (error) {
      alert(error);
      return;
    }

    this.animation?.cancel();
    this.animation = null;
    this.stopBtn.disabled = true;
    this.startBtn.disabled = false;
    this.editBtn.disabled = false;
    this.engineStatus = null;
    this.startEngine = null;
  }

  animate(velocity, distance) {
    this.time = distance / velocity; // in ms

    this.animation = this.carImg.animate(
      [
        {
          transform: `translateX(${this.line.clientWidth}px)`,
        },
      ],
      {
        duration: this.time,
        fill: 'forwards',
      },
    );
  }
}
