import { SitePlugin } from '../site/plugin';

export class DisplayTheme extends SitePlugin {
    public _name = 'Theme';
    private container: HTMLElement;
    private themeToggles: NodeListOf<HTMLElement>;
    private themes = ['moon', 'mountain', 'beach'];

    constructor() {
        super();
        this.container = document.body;
        this.themeToggles = document.querySelectorAll('.themeToggle');

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
    }

    private handleToggle(theme: string): void {
        if (this.themes.indexOf(theme) > -1) {
            this.themes.forEach((t) => {
                this.container.classList.remove(t);
            });
            this.container.classList.add(theme);
        } else {
            console.error('invalid theme');
        }
    }
}
