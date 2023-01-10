import '../../styles/Components/Winners.scss';
import { getWinners } from '../Controllers/winners.controller';
import { getCar } from '../Controllers/car.controller';
import createCar from '../Components/Car';
import Pagination from '../Components/Pagination';

const winnersElement = document.querySelector('.winners');

const winners = {
  winnersList: [],
  page: 1,
  limit: 10,
  sort: 'id',
  order: 'ASC',
  total: 0,
  pagination: null,

  async init() {
    await this.render();
    this.bindEvents();

    this.pagination = new Pagination(
      '.winners__pagination',
      this.total,
      this.limit,
      async (page) => {
        this.page = page;
        await this.renderContent();
      },
    );
  },

  async render() {
    winnersElement.innerHTML = `
      <div class="container">
        <h2 class="winners__title">Winners: 0</h2>
        <table class="winners__table">
          <thead>
            <tr>
              <th class="winners__id">Id</th>
              <th class="winners__img">Car</th>
              <th class="winners__name">Name</th>
              <th class="winners__wins">Wins</th>
              <th class="winners__time">Time</th>
            </tr>
          </thead>
          <tbody class="winners__list">
          </tbody>
        </table>
        <div class="winners__pagination">
        </div>
      </div>
    `;

    this.winnerTitleEl = document.querySelector('.winners__title');
    this.winnersListEl = document.querySelector('.winners__list');

    await this.renderContent();
  },

  async renderContent() {
    const {
      result: cars,
      total,
      error,
    } = await getWinners(this.page, this.limit, this.sort, this.order);

    if (error) {
      alert(error);
      return;
    }

    this.total = total;
    this.winnersList = cars;

    this.winnerTitleEl.textContent = `Winners: ${this.total}`;

    const winnersTable = await this.renderWinnersTemplate();
    this.winnersListEl.innerHTML = winnersTable;

    document.querySelector('.asc')?.classList.remove('asc');
    document.querySelector('.desc')?.classList.remove('desc');
    document
      .querySelector(`.winners__${this.sort}`)
      .classList.add(this.order === 'ASC' ? 'asc' : 'desc');

    this.pagination?.update(this.total, this.page);
  },

  bindEvents() {
    winnersElement.addEventListener('click', async (event) => {
      const { target } = event;

      if (target.classList.contains('asc')) {
        this.order = 'DESC';
        await this.renderContent();
        return;
      }

      if (target.classList.contains('desc')) {
        this.order = 'ASC';
        await this.renderContent();
        return;
      }

      if (target.classList.contains('winners__id')) {
        this.sort = 'id';
        this.page = 1;
        await this.renderContent();
        return;
      }

      if (target.classList.contains('winners__wins')) {
        this.sort = 'wins';
        this.page = 1;
        await this.renderContent();
        return;
      }

      if (target.classList.contains('winners__time')) {
        this.sort = 'time';
        this.page = 1;
        await this.renderContent();
      }
    });
  },

  async renderWinnersTemplate() {
    let template = '';

    const promises = this.winnersList.map(async (winner) => {
      const { result: car, error } = await getCar(winner.id);

      if (error) {
        alert(error);
        return;
      }

      template += `
      <tr>
        <td>${winner.id}</td>
        <td>${createCar(car)}</td>
        <td>${car.name}</td>
        <td>${winner.wins}</td>
        <td>${winner.time}</td>
      </tr>`;
    });

    await Promise.all(promises);

    return template;
  },
};

export default winners;
