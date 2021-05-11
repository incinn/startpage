import { SitePlugin } from '../site/plugin';

export class Search extends SitePlugin {
    public _name = 'Search';
    private searchInput: any;

    constructor() {
        super();
        this.searchInput = document.getElementById('searchInput');
    }

    public init(): void {
        this.searchInput.value = '';

        this.searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                this.submitSearch();
            }
        });
    }

    private submitSearch(): void {
        const query = encodeURI(this.searchInput.value);
        window.location.assign('https://duckduckgo.com/?q=' + query); // keeps history
        // window.location.replace('https://duckduckgo.com/?q=' + query); // removes self from history
    }
}
