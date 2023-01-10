import '../../styles/Components/Garage.scss';
import { addCar, getCars, generateCars } from '../Controllers/car.controller';
import Pagination from '../Components/Pagination';
import CarModal from '../Components/CarModal';
import CarLine from '../Components/CarLine';
import winnerModal from '../Components/WinnerModal';
import { createWinner, getWinner, updateWinner } from '../Controllers/winners.controller';

const garageElement = document.querySelector('.garage');

const garage = {
  carsList: [],
  pagination: null,
  page: 1,
  limit: 7,
  total: 0,
  editCarId: null,
  lines: [],

  async init() {
    await this.render();
    this.bindEvents();

    this.pagination = new Pagination(
      '.garage__pagination',
      this.total,
      this.limit,
      async (page) => {
        this.page = page;
        this.lines = [];
        await this.renderContent();
      },
    );
  },

  async render() {
    garageElement.innerHTML = `
<div class="container">
  <div class="garage__content">
    <h2 class="garage__title">Garage: 0</h2>
    <div class="garage__buttons">
      <button class="button" id="buttonRace">Race</button>
      <button class="button" id="buttonReset">Reset</button>
      <button class="button" id="buttonCreate">Create</button>
      <button class="button" id="buttonGenerate">Generate</button>
    </div>
    <div class="garage__list"></div>
    <div class="garage__pagination"></div>
  </div>
</div>
    `;

    this.garageTitle = document.querySelector('.garage__title');
    this.carsListElement = document.querySelector('.garage__list');
    this.addCarButton = document.getElementById('buttonCreate');
    this.resetButton = document.getElementById('buttonReset');
    this.generateCarsButton = document.getElementById('buttonGenerate');
    this.raceButton = document.getElementById('buttonRace');

    await this.renderContent();
  },

  async renderContent() {
    this.lines = [];
    const { result: cars, error, total } = await getCars(this.page, this.limit);

    this.carsList = cars;
    this.total = total;

    if (error) {
      alert(error);
      return;
    }

    this.garageTitle.textContent = `Garage: ${total}`;

    await this.renderCars();
    this.pagination?.update(this.total, this.page);
  },

  async renderCars() {
    this.carsListElement.innerHTML = '';

    this.carsList.forEach(async (car) => {
      const carLine = new CarLine(car, this.carsListElement, this.renderContent.bind(this));
      this.lines.push(carLine);
    });
  },

  bindEvents() {
    this.addCarButton.addEventListener('click', this.addCar.bind(this));
    this.generateCarsButton.addEventListener('click', this.generateCars.bind(this));
    this.resetButton.addEventListener('click', this.resetCars.bind(this));
    this.raceButton.addEventListener('click', this.race.bind(this));
  },

  addCar() {
    const carModal = new CarModal();

    carModal.onSubmit = async (name, color) => {
      const { error } = await addCar(name, color);

      if (error) {
        alert(error);
        return;
      }

      this.renderContent();
    };

    carModal.init();
  },

  async generateCars() {
    const { error } = await generateCars();

    if (error) {
      alert(error);
      return;
    }

    this.renderContent();
  },

  async resetCars() {
    const reset = this.lines.map((line) => line.animation && line.stop());

    Promise.all(reset).then(() => {
      this.addCarButton.disabled = false;
      this.generateCarsButton.disabled = false;
      this.raceButton.disabled = false;
    });
  },

  race() {
    this.addCarButton.disabled = true;
    this.generateCarsButton.disabled = true;
    this.raceButton.disabled = true;
    this.resetButton.disabled = true;

    const race = this.lines.map((line) => line.drive());

    Promise.any(race)
      .then(async (winner) => {
        winnerModal.show(winner);
        await this.updateOrCreateWinner(winner);
      })
      .finally(() => {
        this.resetButton.disabled = false;
      });
  },

  async updateOrCreateWinner(winner) {
    const { result: existingWinner } = await getWinner(winner.car.id);

    if (existingWinner.id) {
      existingWinner.wins += 1;
      existingWinner.time = parseFloat(winner.time) < parseFloat(existingWinner.time)
        ? winner.time
        : existingWinner.time;
      await updateWinner(existingWinner);
    } else {
      await createWinner({ id: winner.car.id, wins: 1, time: winner.time });
    }
  },
};

export default garage;
