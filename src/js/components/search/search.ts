import { SitePlugin } from '../site/plugin';

export enum SearchMode {
    assign, // keeps history
    replace, // removes history
}

export class Search extends SitePlugin {
    public _name = 'Search';
    private searchInput: any;
    private mode: SearchMode;

    constructor() {
        super();
        this.mode = SearchMode.assign;
        this.searchInput = document.getElementById('searchInput');
    }

    public init(): void {
        this.searchInput.value = '';

        this.searchInput.addEventListener('keyup', (event: KeyboardEvent) => {
            this.handleKeyPress(event);
        });
    }

    private handleKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.submitSearch();
        }

        if (event.key === 'Escape') {
            this.searchInput.value = '';
        }
    }

    private submitSearch(): void {
        const query = encodeURI(this.searchInput.value);
        if (this.mode === SearchMode.assign) {
            window.location.assign('https://duckduckgo.com/?q=' + query);
        } else if (this.mode === SearchMode.replace) {
            window.location.replace('https://duckduckgo.com/?q=' + query);
        } else {
            console.error(`Search mode ${this.mode} invalid`);
        }
    }
}
