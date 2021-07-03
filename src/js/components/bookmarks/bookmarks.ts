import { SitePlugin } from '../site/plugin';

interface Bookmark {
    favicon: string;
    url: string;
    text: string;
}

export class Bookmarks extends SitePlugin {
    public _name = 'Bookmarks';
    public _refresh = false;

    private bookmarksContainerEl: HTMLElement;

    private bookmarks: Bookmark[] = [
        {
            favicon: 'https://www.startpage.com/favicon.ico',
            url: 'https://startpage.com',
            text: 'startpage',
        },
        {
            favicon: 'https://www.youtube.com/favicon.ico',
            url: 'https://youtube.com',
            text: 'youtube',
        },
        {
            favicon: 'https://old.reddit.com/favicon.ico',
            url: 'https://old.reddit.com',
            text: 'old reddit',
        },
        {
            favicon: 'https://www.duckduckgo.com/favicon.ico',
            url: 'https://duckduckgo.com',
            text: 'duckduckgo',
        },
        {
            favicon: 'https://bbc.co.uk/favicon.ico',
            url: 'https://bbc.co.uk',
            text: 'bbc.co.uk',
        },
        {
            favicon: 'https://www.startpage.com/favicon.ico',
            url: 'https://startpage.com',
            text: 'startpage',
        },
        {
            favicon: 'https://news.ycombinator.com/favicon.ico',
            url: 'https://news.ycombinator.com',
            text: 'hacker news',
        },
    ];

    constructor() {
        super();

        this.bookmarksContainerEl = document.getElementById(
            'bookmarksContainer'
        ) as HTMLElement;
    }

    public init(): void {
        this.render();
    }

    private render(): void {
        this.bookmarks.forEach((bookmark) => {
            this.bookmarksContainerEl.appendChild(this.buildBookmark(bookmark));
        });
    }

    private buildBookmark(b: Bookmark): HTMLElement {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const img = document.createElement('img');
        const span = document.createElement('span');

        a.appendChild(img);
        a.appendChild(span);
        li.appendChild(a);

        a.href = b.url;
        a.target = '_blank';
        a.title = b.text;

        img.src = b.favicon;

        span.innerHTML = b.text;

        return li;
    }

    private grabFavicon(url: string): Promise<string> {
        const image = new Image();
        image.crossOrigin = '*';
        image.src = url;

        document.body.appendChild(image);

        return new Promise((resolve, reject) => {
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.height = image.height;
                canvas.width = image.width;
                ctx.drawImage(image, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };

            image.onerror = () => {
                reject();
            };
        });
    }
}
