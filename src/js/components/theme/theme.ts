import { PluginStorage, SitePlugin } from '../site/plugin';

export interface ThemeSettings {
    name: string;
    random: boolean;
}

export class DisplayTheme extends SitePlugin {
    public _name = 'Theme';
    private container: HTMLElement;
    private randomBtn: HTMLElement;
    private themeToggles: NodeListOf<HTMLElement>;
    private themes = ['moon', 'mountain', 'cat', 'nlights'];
    private settings: ThemeSettings;

    constructor() {
        super();

        this.container = document.body;
        this.themeToggles = document.querySelectorAll(
            '.themeSettings__options__toggle:not(#randomTheme)'
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

        const storage: PluginStorage<ThemeSettings> = this.getStorage();
        if (storage.data) {
            this.settings = storage.data;
        } else {
            this.settings = {
                name: 'mountain',
                random: true,
            };
        }

        this.renderTheme();
    }

    private updateStorage(settings): void {
        const s: ThemeSettings = { ...this.settings, ...settings };

        if (s.name !== this.settings.name) {
            s.random = false;
        }

        this.setStorage({ lastChange: 0, data: s });
        this.settings = s;
    }

    private renderTheme(): void {
        const theme: string = this.settings.random
            ? this.themes[Math.floor(Math.random() * this.themes.length)]
            : this.settings.name;

        document.body.classList.remove('loading');
        document.body.classList.add('loaded');

        this.themes.forEach((t) => {
            t === theme
                ? this.container.classList.add(t)
                : this.container.classList.remove(t);
        });

        this.updateSettingsButtonState();
    }

    private handleToggle(theme: string): void {
        if (this.themes.indexOf(theme) > -1) {
            this.updateStorage({ name: theme });
            this.renderTheme();
        } else {
            console.error('invalid theme selected');
        }
    }

    private updateSettingsButtonState(): void {
        this.randomBtn.classList.remove('selected');

        this.themeToggles.forEach((toggle) => {
            toggle.classList.remove('selected');

            if (!this.settings.random) {
                if (toggle.dataset.id === this.settings.name) {
                    toggle.classList.add('selected');
                }
            }
        });

        if (!this.settings || !this.settings.name || this.settings.random) {
            this.randomBtn.classList.add('selected');
        }
    }

    private randomTheme(): void {
        this.updateStorage({ random: true });
        this.renderTheme();
    }
}
