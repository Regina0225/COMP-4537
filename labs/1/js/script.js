import { MESSAGES } from "../lang/messages/en/user.js";

// Created with assistance from AI

class GameButton {
  constructor(number, color, gameArea) {
    this.number = number;
    this.color = color;
    this.gameArea = gameArea;
    this.element = document.createElement("button");
    this.element.className = "memory-button";
    this.element.type = "button";
    this.element.textContent = this.number;
    this.element.style.backgroundColor = this.color;
    this.element.disabled = true;
  }

  addClickHandler(handler) {
    this.element.addEventListener("click", () => handler(this));
  }

  showNumber() {
    this.element.textContent = this.number;
  }

  hideNumber() {
    this.element.textContent = "";
  }

  disable() {
    this.element.disabled = true;
    this.element.classList.remove("clickable");
  }

  enable() {
    this.element.disabled = false;
    this.element.classList.add("clickable");
  }

  placeInRow() {
    this.element.classList.remove("ready");
    this.element.style.left = "";
    this.element.style.top = "";
    this.gameArea.appendChild(this.element);
  }

  moveRandomly() {
    this.element.classList.add("ready");

    const width = this.element.offsetWidth;
    const height = this.element.offsetHeight;
    const area = this.gameArea.getBoundingClientRect();
    const maxX = Math.max(0, window.innerWidth - area.left - width);
    const maxY = Math.max(0, window.innerHeight - area.top - height);
    const left = Math.floor(Math.random() * (maxX + 1));
    const top = Math.floor(Math.random() * (maxY + 1));

    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }
}

class UserInterface {
  constructor() {
    this.countInput = document.getElementById("button-count");
    this.countLabel = document.getElementById("button-count-label");
    this.startButton = document.getElementById("start-button");
    this.message = document.getElementById("message");
    this.gameArea = document.getElementById("game-area");
  }

  setText() {
    document.title = MESSAGES.pageTitle;
    this.gameArea.setAttribute("aria-label", MESSAGES.gameAreaLabel);
    this.countLabel.textContent = MESSAGES.countLabel;
    this.startButton.textContent = MESSAGES.startButton;
  }

  getButtonCount() {
    return Number(this.countInput.value);
  }

  onStart(callback) {
    this.startButton.addEventListener("click", callback);
  }

  clearButtons() {
    this.gameArea.innerHTML = "";
  }

  showMessage(text, type = "") {
    this.message.textContent = text;
    this.message.className = `message ${type}`.trim();
  }

}

class MemoryGame {
  constructor(ui) {
    this.ui = ui;
    this.buttons = [];
    this.nextNumber = 1;
    this.timerIds = [];
  }

  start() {
    this.reset();

    const totalButtons = this.ui.getButtonCount();

    if (!this.isValidCount(totalButtons)) {
      return;
    }

    this.ui.showMessage(MESSAGES.waiting);
    this.createButtons(totalButtons);
    this.scheduleScramble(totalButtons);
  }

  reset() {
    this.timerIds.forEach((timerId) => clearTimeout(timerId));
    this.timerIds = [];
    this.buttons = [];
    this.nextNumber = 1;
    this.ui.clearButtons();
    this.ui.showMessage("");
  }

  isValidCount(totalButtons) {
    if (!totalButtons) {
      this.ui.showMessage(MESSAGES.emptyError, "error");
      return false;
    }

    if (!Number.isInteger(totalButtons)) {
      this.ui.showMessage(MESSAGES.integerError, "error");
      return false;
    }

    if (totalButtons < 3 || totalButtons > 7) {
      this.ui.showMessage(MESSAGES.rangeError, "error");
      return false;
    }

    return true;
  }

  createButtons(totalButtons) {
    for (let number = 1; number <= totalButtons; number++) {
      const button = new GameButton(number, this.getRandomColor(), this.ui.gameArea);
      button.addClickHandler((clickedButton) => this.checkAnswer(clickedButton));
      button.placeInRow();
      this.buttons.push(button);
    }
  }

  scheduleScramble(totalButtons) {
    for (let round = 1; round <= totalButtons; round++) {
      const delay = (totalButtons + (round - 1) * 2) * 1000;
      const timerId = setTimeout(() => this.scramble(round, totalButtons), delay);
      this.timerIds.push(timerId);
    }
  }

  scramble(round, totalRounds) {
    this.ui.showMessage(MESSAGES.scrambling);
    this.buttons.forEach((button) => button.moveRandomly());

    if (round === totalRounds) {
      const timerId = setTimeout(() => this.prepareGuessing(), 400);
      this.timerIds.push(timerId);
    }
  }

  prepareGuessing() {
    this.buttons.forEach((button) => {
      button.hideNumber();
      button.enable();
    });
    this.ui.showMessage(MESSAGES.ready);
  }

  checkAnswer(button) {
    if (button.number === this.nextNumber) {
      button.showNumber();
      button.disable();
      this.nextNumber++;

      if (this.nextNumber > this.buttons.length) {
        this.ui.showMessage(MESSAGES.excellent, "success");
        this.buttons.forEach((gameButton) => gameButton.disable());
      }

      return;
    }

    this.ui.showMessage(MESSAGES.wrong, "error");
    this.buttons.forEach((gameButton) => {
      gameButton.showNumber();
      gameButton.disable();
    });
  }

  getRandomColor() {
    const red = this.getRandomNumber(80, 255);
    const green = this.getRandomNumber(80, 255);
    const blue = this.getRandomNumber(80, 255);

    return `rgb(${red}, ${green}, ${blue})`;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

const ui = new UserInterface();
const game = new MemoryGame(ui);

ui.setText();
ui.onStart(() => game.start());
