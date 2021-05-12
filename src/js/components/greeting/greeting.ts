import { SitePlugin } from '../site/plugin';
import { Greeting } from './greeting.enum';

export class DisplayGreeting extends SitePlugin {
    public _name = 'Display Greeting';
    public _refresh = true;
    private container: HTMLElement;

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
    }

    public onRefresh(): void {
        this.init();
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
