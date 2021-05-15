import { SitePlugin } from '../site/plugin';

export class DisplayTheme extends SitePlugin {
    public _name = 'Theme';
    private container: HTMLElement;
    private themeToggles: NodeListOf<HTMLElement>;
    private theme: string = 'mountain';
    private themes = ['moon', 'mountain', 'beach', 'nlights'];

    constructor() {
        super();
        this.container = document.body;
        this.themeToggles = document.querySelectorAll(
            '.themeSettings__options__toggle'
        );

        if (!this.container || !this.themeToggles) {
            console.error('Unable to find required elements');
            this.init = () => {};
        }

        // random theme mode
        this.setTheme(
            this.themes[Math.floor(Math.random() * this.themes.length)]
        );
    }

    public init(): void {
        this.themeToggles.forEach((toggle) => {
            toggle.addEventListener('click', () =>
                this.setTheme(toggle.dataset.id)
            );
        });

        this.showActiveTheme();
    }

    private setTheme(theme: string): void {
        if (this.themes.indexOf(theme) > -1) {
            this.themes.forEach((t) => {
                this.container.classList.remove(t);
            });
            this.container.classList.add(theme);
            this.theme = theme;
            this.showActiveTheme();
        } else {
            console.error('invalid theme');
        }
    }

    private showActiveTheme(): void {
        this.themeToggles.forEach((toggle) => {
            if (toggle.dataset.id !== this.theme) {
                toggle.classList.remove('active');
            } else {
                toggle.classList.add('active');
            }
        });
    }
}
