import '../../styles/Components/Pagination.scss';

class Pagination {
  constructor(parent, total, limit, callback) {
    this.parent = parent;
    this.parentElement = document.querySelector(parent);
    this.total = total;
    this.limit = limit;
    this.page = 1;
    this.callback = callback;

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    const pages = Math.ceil(this.total / this.limit) || 1;

    this.parentElement.innerHTML = `
    <div class="pagination">
      <button class="pagination__button pagination__button--prev" ${this.page === 1 ? 'disabled' : ''}>&lt;</button>
      <span class="pagination__text">${this.page}</span>
      <button class="pagination__button pagination__button--next" ${this.page === pages ? 'disabled' : ''}>&gt;</button>
    </div>
    `;
  }

  bindEvents() {
    this.parentElement.addEventListener('click', async (event) => {
      const { target } = event;

      if (target.classList.contains('pagination__button--prev')) {
        this.page -= 1;
        await this.callback(this.page);
      }

      if (target.classList.contains('pagination__button--next')) {
        this.page += 1;
        await this.callback(this.page);
      }
    });
  }

  update(total, page) {
    this.total = total;
    this.page = page;

    if (total / this.limit === page - 1 && page > 1) {
      this.page -= 1;
      this.callback(this.page);
      return;
    }

    this.render();
  }
}

export default Pagination;
