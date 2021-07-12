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

interface BookmarkStorage {
    settings: BookmarksSettings;
    bookmarks: Bookmark[];
}

export class Bookmarks extends SitePlugin {
    public _name = 'Bookmarks';
    public _refresh = false;

    private bookmarksContainerEl: HTMLElement;
    private bookmarksSettingsContainerEl: HTMLElement;

    private bookmarks: Bookmark[];
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
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
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

        const storage: PluginStorage<BookmarkStorage> = this.getStorage();
        this.settings = storage.data?.settings;
        this.bookmarks = storage.data?.bookmarks;

        if (!this.settings) {
            this.settings = {
                show: true,
                showIcons: true,
            };
        }

        if (!this.bookmarks) {
            this.bookmarks = this.initialBookmarks;
        }

        if (!this.settings || !this.bookmarks) {
            this.updateStorage();
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
            this.bookmarks.forEach((bookmark) => {
                this.bookmarksContainerEl.appendChild(
                    this.buildBookmark(bookmark)
                );
            });
        }
    }

    private renderSettings(): void {
        this.bookmarksSettingsContainerEl.textContent = '';

        this.bookmarks.forEach((bookmark) => {
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

    private updateStorage(): void {
        this.setStorage({
            lastChange: 0,
            data: {
                bookmarks: this.bookmarks,
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
        this.updateStorage();
        this.renderDisplay();
    }

    private handleShowIconsInputInputToggle(e: any): void {
        this.settings.showIcons = e.target.checked;
        this.updateStorage();
        this.renderDisplay();
    }

    private handleBookmarkRemoveButton(e: any): void {
        this.bookmarks = this.bookmarks.filter((bookmark) => {
            return bookmark.id !== e.srcElement.dataset.id;
        });

        this.updateStorage();
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

        this.bookmarks = [...this.bookmarks, newBm];

        this.updateStorage();
        this.render();

        this.newBookmarkUrlEl.value = '';
        this.newBookmarkTextEl.value = '';
    }
}
