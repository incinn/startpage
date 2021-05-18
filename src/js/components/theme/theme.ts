import { SitePlugin } from '../site/plugin';

export class DisplayTheme extends SitePlugin {
    public _name = 'Theme';
    private container: HTMLElement;
    private randomBtn: HTMLElement;
    private themeToggles: NodeListOf<HTMLElement>;
    private theme: string = 'mountain';
    private themes = ['moon', 'mountain', 'cat', 'nlights'];
    private data: any;

    constructor() {
        super();
        this.container = document.body;
        this.themeToggles = document.querySelectorAll(
            '.themeSettings__options__toggle'
        );
        this.randomBtn = document.getElementById('randomTheme');

        if (!this.container || !this.themeToggles) {
            console.error('Unable to find required elements');
            this.init = () => {};
        }
    }

    public init(): void {
        this.themeToggles.forEach((toggle) => {
            toggle.addEventListener('click', () =>
                this.handleToggle(toggle.dataset.id)
            );
        });

        this.randomBtn.addEventListener('click', () => this.randomTheme());

        this.getData();
        this.data ? this.setTheme(this.data.data) : this.setRandomTheme();

        this.showActiveTheme();
    }

    private getData(): void {
        this.data = this.getStorage();
    }

    private setTheme(theme: string): void {
        this.themes.forEach((t) => {
            this.container.classList.remove(t);
        });
        this.container.classList.add(theme);
        this.theme = theme;
        this.showActiveTheme();
    }

    private handleToggle(theme: string): void {
        if (this.themes.indexOf(theme) > -1) {
            this.setStorage({ lastChange: 0, data: theme });
            this.getData();
            this.setTheme(theme);
        } else {
            console.error('invalid theme');
        }
    }

    private showActiveTheme(): void {
        this.themeToggles.forEach((toggle) => {
            toggle.classList.remove('selected');
            toggle.classList.remove('active');

            if (toggle.dataset.id === this.theme) {
                toggle.classList.add('active');
            }

            if (this.data && this.data.data == toggle.dataset.id) {
                toggle.classList.add('selected');
            }
        });
    }

    private setRandomTheme(): void {
        this.setTheme(
            this.themes[Math.floor(Math.random() * this.themes.length)]
        );
    }

    private randomTheme(): void {
        this.destroyStorage();
        this.getData();
        this.setRandomTheme();
    }
}
