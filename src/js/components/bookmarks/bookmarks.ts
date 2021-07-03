import { PluginStorage, SitePlugin } from '../site/plugin';

interface Bookmark {
    favicon: string;
    url: string;
    text: string;
}

interface BookmarksSettings {
    show: boolean;
    showIcons: boolean;
}

export class Bookmarks extends SitePlugin {
    public _name = 'Bookmarks';
    public _refresh = false;

    private bookmarksContainerEl: HTMLElement;
    private settings: BookmarksSettings;

    private initialBookmarks: Bookmark[] = [
        {
            favicon: 'https://barnz.dev/barnz.dev-favicon.png',
            url: 'https://barnz.dev',
            text: 'barnz.dev',
        },
        {
            favicon: 'https://news.ycombinator.com/favicon.ico',
            url: 'https://news.ycombinator.com',
            text: 'hacker news',
        },
        {
            favicon: 'https://www.youtube.com/favicon.ico',
            url: 'https://youtube.com',
            text: 'youtube',
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
    ];

    constructor() {
        super();

        this.bookmarksContainerEl = document.getElementById(
            'bookmarksContainer'
        ) as HTMLElement;

        this.settings = this.getStorage()?.data.settings;
        if (!this.settings) {
            this.settings = {
                show: true,
                showIcons: true,
            };

            this.updateStorage(this.initialBookmarks);
        }
    }

    public init(): void {
        this.render();
    }

    private render(): void {
        if (this.settings.show) {
            const bookmarks: Bookmark[] = this.getStorage()?.data.bookmarks;

            bookmarks.forEach((bookmark) => {
                this.bookmarksContainerEl.appendChild(
                    this.buildBookmark(bookmark)
                );
            });
        }
    }

    private updateStorage(data: Bookmark[]): void {
        this.setStorage({
            lastChange: 0,
            data: {
                bookmarks: data,
                settings: this.settings,
            },
        });
    }

    private buildBookmark(b: Bookmark): HTMLElement {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const span = document.createElement('span');
        let img: HTMLImageElement;

        if (this.settings.showIcons) {
            img = new Image();
            a.appendChild(img);
        }

        a.appendChild(span);
        li.appendChild(a);

        a.href = b.url;
        a.target = '_blank';
        a.title = b.text;

        if (this.settings.showIcons) {
            img.src = b.favicon;
            img.loading = 'lazy';
        }

        span.innerText = b.text;

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
