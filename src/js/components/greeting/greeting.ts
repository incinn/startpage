import { Greeting } from './greeting.enum';

export class DisplayGreeting {
    private container: HTMLElement;

    constructor() {
        this.container = document.getElementById('welcomeContainer');

        if (!this.container) {
            console.error('Unable to find welcomeContainer');
            this.init = () => {};
        }
    }

    public init(): void {
        const now = new Date();
        if (now.getHours() >= 0 && now.getHours() <= 11)
            this.container.innerHTML = Greeting.morning;
        else if (now.getHours() >= 12 && now.getHours() <= 17)
            this.container.innerHTML = Greeting.afternoon;
        else if (now.getHours() >= 18)
            this.container.innerHTML = Greeting.evening;
    }
}
