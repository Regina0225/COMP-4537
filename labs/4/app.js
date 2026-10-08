const Math = require("./math");

class App {
    constructor() {
        this.math = new Math();
    }

    run() {
        const num1 = 2;
        const num2 = 3;

        const sum = this.math.add(num1, num2);
        const difference = this.math.subtract(num1, num2);

        console.log(`Regina: ${num1} + ${num2} = ${sum}`);
        console.log(`Regina: ${num1} - ${num2} = ${difference}`);
    }
}

const app = new App();
app.run();