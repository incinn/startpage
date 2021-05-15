import { SitePlugin } from '../site/plugin';

export class DisplaySettings extends SitePlugin {
    public _name = 'Settings';
    private toggle: HTMLElement;
    private container: HTMLElement;
    private underlay: HTMLElement;

    constructor() {
        super();
        this.toggle = document.getElementById('settingsToggle');
        this.container = document.getElementById('settingsContainer');
        this.underlay = document.getElementById('settingsUnderlay');

        if (!this.toggle || !this.container || !this.underlay) {
            console.error('Unable to find required elements');
            this.init = () => {};
        }
    }

    public init(): void {
        this.toggle.addEventListener('click', () => this.handleToggle());
        this.underlay.addEventListener('click', () =>
            this.handleUnderlayClick()
        );
    }

    private handleToggle(): void {
        this.container.classList.toggle('show');
    }

    private handleUnderlayClick(): void {
        this.container.classList.remove('show');
    }

    public destroy(): void {}
}
