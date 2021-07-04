import { PluginStorage, SitePlugin } from '../site/plugin';
import { v4 as uuid } from 'uuid';

interface Bookmark {
    id: string;
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
    private bookmarksSettingsContainerEl: HTMLElement;
    private settings: BookmarksSettings;

    private showBookmarksInput: HTMLInputElement;
    private showIconsInput: HTMLInputElement;

    private newBookmarkUrlEl: HTMLInputElement;
    private newBookmarkTextEl: HTMLInputElement;
    private newBookmarkSubmitBtn: HTMLButtonElement;

    private initialBookmarks: Bookmark[] = [
        {
            id: uuid(),
            favicon: 'https://barnz.dev/barnz.dev-favicon.png',
            url: 'https://barnz.dev',
            text: 'barnz.dev',
        },
        {
            id: uuid(),
            favicon: 'https://news.ycombinator.com/favicon.ico',
            url: 'https://news.ycombinator.com',
            text: 'hacker news',
        },
        {
            id: uuid(),
            favicon: 'https://et.trackbase.net/favicon.ico',
            url: 'https://et.trackbase.net/server/etc',
            text: 'trackbase',
        },
        {
            id: uuid(),
            favicon: 'https://stackoverflow.com/favicon.ico',
            url: 'https://stackoverflow.com',
            text: 'stackoverflow',
        },
    ];

    constructor() {
        super();

        this.bookmarksContainerEl = document.getElementById(
            'bookmarksContainer'
        ) as HTMLElement;

        this.bookmarksSettingsContainerEl = document.getElementById(
            'listBookmarks'
        ) as HTMLElement;

        this.showBookmarksInput = document.getElementById(
            'showBookmarks'
        ) as HTMLInputElement;
        this.showIconsInput = document.getElementById(
            'showIcons'
        ) as HTMLInputElement;

        this.newBookmarkUrlEl = document.getElementById(
            'newBookmarkUrl'
        ) as HTMLInputElement;
        this.newBookmarkTextEl = document.getElementById(
            'newBookmarkText'
        ) as HTMLInputElement;
        this.newBookmarkSubmitBtn = document.getElementById(
            'newBookmarkSubmit'
        ) as HTMLButtonElement;

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
        this.renderSettings();

        this.showBookmarksInput.checked = this.settings.show;
        this.showIconsInput.checked = this.settings.showIcons;

        this.showBookmarksInput.addEventListener('change', (e) => {
            this.handleShowBookmarksInputToggle(e);
        });

        this.showIconsInput.addEventListener('change', (e) => {
            this.handleShowIconsInputInputToggle(e);
        });

        this.newBookmarkSubmitBtn.addEventListener('click', () => {
            this.handleNewBookmarkButton();
        });
    }

    private render(): void {
        this.renderDisplay();
        this.renderSettings();
    }

    private renderDisplay(): void {
        this.bookmarksContainerEl.textContent = '';

        if (this.settings.show) {
            const bookmarks: Bookmark[] = this.getStorage()?.data.bookmarks;

            bookmarks.forEach((bookmark) => {
                this.bookmarksContainerEl.appendChild(
                    this.buildBookmark(bookmark)
                );
            });
        }
    }

    private renderSettings(): void {
        const bookmarks: Bookmark[] = this.getStorage()?.data.bookmarks;
        this.bookmarksSettingsContainerEl.textContent = '';

        bookmarks.forEach((bookmark) => {
            this.bookmarksSettingsContainerEl.appendChild(
                this.buildSettingsBookmarkElement(bookmark)
            );
        });
    }

    private buildSettingsBookmarkElement(b: Bookmark): HTMLElement {
        const li = document.createElement('li');
        const urlInput = document.createElement('input');
        const textInput = document.createElement('input');
        const removeBtn = document.createElement('button');
        const img = new Image();

        li.appendChild(img);
        li.appendChild(urlInput);
        li.appendChild(textInput);
        li.appendChild(removeBtn);

        urlInput.value = b.url;
        urlInput.type = 'text';
        textInput.value = b.text;
        textInput.type = 'text';
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('btn', 'btn-light');
        removeBtn.dataset.id = b.id;

        img.src = b.favicon;

        removeBtn.addEventListener('click', (e: any) => {
            this.handleBookmarkRemoveButton(e);
        });

        return li;
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

    private handleShowBookmarksInputToggle(e: any): void {
        this.settings.show = e.target.checked;
        // this.updateStorage();
        this.renderDisplay();
    }

    private handleShowIconsInputInputToggle(e: any): void {
        this.settings.showIcons = e.target.checked;
        this.renderDisplay();
    }

    private handleBookmarkRemoveButton(e: any): void {
        const bookmarks = this.getStorage()?.data.bookmarks.filter(
            (bookmark) => {
                return bookmark.id !== e.srcElement.dataset.id;
            }
        );

        this.updateStorage(bookmarks);
        this.render();
    }

    private handleNewBookmarkButton(): void {
        const rawUrl = this.newBookmarkUrlEl.value;
        const text = this.newBookmarkTextEl.value;

        this.newBookmarkUrlEl.classList.remove('error');
        this.newBookmarkTextEl.classList.remove('error');

        if (rawUrl.length < 11 || !/^(http|https):\/\/[^ "]+$/.test(rawUrl)) {
            this.newBookmarkUrlEl.classList.add('error');
            return;
        }

        if (text.length < 1) {
            this.newBookmarkTextEl.classList.add('error');
            return;
        }

        const url: URL = new URL(rawUrl);

        const newBm: Bookmark = {
            id: uuid(),
            favicon: url.protocol + '//' + url.hostname + '/favicon.ico',
            url: url.href,
            text,
        };

        this.updateStorage([...this.getStorage()?.data.bookmarks, newBm]);
        this.render();

        this.newBookmarkUrlEl.value = '';
        this.newBookmarkTextEl.value = '';
    }
}
