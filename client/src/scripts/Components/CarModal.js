import '../../styles/Components/Modal.scss';

export default class CarModal {
  constructor(id, name, color) {
    this.id = id || null;
    this.name = name || null;
    this.color = color || null;
    this.modal = null;
    this.onSubmit = null;
  }

  render() {
    const body = document.querySelector('body');
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
    <div class="modal__overlay"></div>
    <div class="modal__content">
      <h3 class="modal__title">${this.id ? 'Edit' : 'Create'}</h3>
      <div class="modal__form">
        <input class="modal__input input" type="text" id="form-name" placeholder="Car name" />
        <input class="modal__input input--color" id="form-color" type="color" />
        <button class="modal__button button modal__button--submit" id="form-submit" type="button">
          ${this.id ? 'Update' : 'Create'}
        </button>
        <button class="modal__button button" id="form-cancel" type="button">Cancel</button>
      </div>
    </div>
    `;

    this.modal = modal;
    body.insertAdjacentElement('beforeend', modal);
    this.nameInput = document.getElementById('form-name');
    this.colorInput = document.getElementById('form-color');

    if (this.name && this.color) {
      this.nameInput.value = this.name;
      this.colorInput.value = this.color;
    }
  }

  bindEvents() {
    // on esc key press
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.destroy();
      }
    });

    const cancelButton = document.getElementById('form-cancel');
    cancelButton.addEventListener('click', () => {
      this.destroy();
    });

    const overlay = document.querySelector('.modal__overlay');
    overlay.addEventListener('click', () => {
      this.destroy();
    });

    const submitButton = document.getElementById('form-submit');
    submitButton.addEventListener('click', async () => {
      await this.submit();
      this.destroy();
    });
  }

  destroy() {
    this.modal.remove();
  }

  async submit() {
    const name = this.nameInput.value;
    const color = this.colorInput.value;
    await this.onSubmit(name, color);
  }

  async init() {
    this.render();
    this.bindEvents();
  }
}
