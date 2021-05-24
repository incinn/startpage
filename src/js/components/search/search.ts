import { SitePlugin } from '../site/plugin';

export enum SearchMode {
    assign, // keeps history
    replace, // removes history
}

export class Search extends SitePlugin {
    public _name = 'Search';
    private searchInput: HTMLInputElement;
    private searchWrapper: HTMLElement;
    private searchBtn: HTMLButtonElement;
    private mode: SearchMode;

    constructor() {
        super();
        this.mode = SearchMode.assign;
        this.searchInput = document.getElementById(
            'searchInput'
        ) as HTMLInputElement;
        this.searchWrapper = document.getElementById('searchWrapper');
        this.searchBtn = document.getElementById(
            'searchButton'
        ) as HTMLButtonElement;
    }

    public init(): void {
        this.searchInput.value = '';

        this.searchInput.addEventListener('keyup', (event: KeyboardEvent) => {
            this.handleKeyPress(event);
            this.toggleHelp();
        });

        this.searchBtn.addEventListener('click', () => this.submitSearch());
    }

    private handleKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.submitSearch();
        }

        if (event.key === 'Escape') {
            this.searchInput.value = '';
        }
    }

    private toggleHelp(): void {
        if (this.searchInput.value[0] === '!') {
            this.searchWrapper.classList.add('showHelp');
        } else {
            this.searchWrapper.classList.remove('showHelp');
        }
    }

    private submitSearch(): void {
        const query = encodeURI(this.searchInput.value);
        if (query.length > 0) {
            if (this.mode === SearchMode.assign) {
                window.location.assign('https://duckduckgo.com/?q=' + query);
            } else if (this.mode === SearchMode.replace) {
                window.location.replace('https://duckduckgo.com/?q=' + query);
            } else {
                console.error(`Search mode ${this.mode} invalid`);
            }
        }
    }
}
