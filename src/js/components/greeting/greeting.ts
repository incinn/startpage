import { SitePlugin } from '../site/plugin';
import { Greeting } from './greeting.enum';

export class DisplayGreeting extends SitePlugin {
    public _name = 'Display Greeting';
    private container: HTMLElement;
    private timer: any;

    constructor() {
        super();
        this.container = document.getElementById('welcomeContainer');

        if (!this.container) {
            console.error('Unable to find welcomeContainer');
            this.init = () => {};
        }
    }

    public init(): void {
        this.setWelcome();
        this.timer = setInterval(() => this.setWelcome(), 3600000);
    }

    public destroy(): void {
        clearInterval(this.timer);
    }

    private setWelcome(): void {
        const now = new Date();
        if (now.getHours() >= 0 && now.getHours() <= 11)
            this.container.innerHTML = Greeting.morning;
        else if (now.getHours() >= 12 && now.getHours() <= 17)
            this.container.innerHTML = Greeting.afternoon;
        else if (now.getHours() >= 18)
            this.container.innerHTML = Greeting.evening;
    }
}
