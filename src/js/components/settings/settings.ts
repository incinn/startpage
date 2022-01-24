import { SitePlugin } from '../site/plugin';
import * as _ from 'lodash';

export class DisplaySettings extends SitePlugin {
    public _name = 'Settings';
    private open = false;
    private activeTab = 'date';

    private toggle: HTMLElement;
    private container: HTMLElement;
    private underlay: HTMLElement;
    private tabItems: NodeListOf<HTMLElement>;
    private tabContent: NodeListOf<HTMLElement>;

    constructor() {
        super();

        this.toggle = document.getElementById('settingsToggle');
        this.container = document.getElementById('settingsContainer');
        this.underlay = document.getElementById('settingsUnderlay');
        this.tabItems = document.querySelectorAll(
            '#settingsContainer .settings__content__tabs li'
        );
        this.tabContent = document.querySelectorAll(
            '#settingsContainer .settings__content .settings__area'
        );

        if (
            !this.toggle ||
            !this.container ||
            !this.underlay ||
            !this.tabItems
        ) {
            console.error('Unable to find required elements');
            this.init = () => {};
        }
    }

    public init(): void {
        this.toggle.addEventListener('click', () => this.handleToggle());
        this.underlay.addEventListener('click', () =>
            this.handleUnderlayClick()
        );
        this.tabItems.forEach((tab) => {
            tab.addEventListener('click', () =>
                this.handleTabClick(tab.dataset.tab)
            );
        });

        this.displayActiveTab();
        this.scrollTabIntoView();

        document
            .querySelector('.settings__content__inner')
            .addEventListener(
                'scroll',
                _.throttle(this.handleScroll.bind(this), 200)
            );
    }

    private handleToggle(): void {
        if (this.open) {
            this.container.classList.remove('show');

            setTimeout(() => {
                this.container.classList.remove('loading');
            }, 100);
        } else {
            this.container.classList.add('loading');

            setTimeout(() => {
                this.container.classList.add('show');
            }, 100);
        }

        this.open = !this.open;
    }

    private handleUnderlayClick(): void {
        this.open = true;
        this.handleToggle();
    }

    private handleTabClick(tab: string): void {
        this.activeTab = tab;
        this.displayActiveTab();
        this.scrollTabIntoView();
    }

    private displayActiveTab(): void {
        this.tabItems.forEach((tabEl) => {
            if (tabEl.dataset.tab === this.activeTab) {
                tabEl.classList.add('active');
            } else {
                tabEl.classList.remove('active');
            }
        });
    }

    private scrollTabIntoView(): void {
        this.tabContent.forEach((tabEl) => {
            if (tabEl.dataset.tab === this.activeTab) {
                tabEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    private handleScroll(): void {
        const wrapper = document.querySelector('.settings__content__inner');

        const tabContentTitle: NodeListOf<HTMLElement> =
            document.querySelectorAll(
                '#settingsContainer .settings__content .settings__area h2'
            );

        const isVisible = function (ele, container) {
            const { bottom, height, top } = ele.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            return top <= containerRect.top
                ? containerRect.top - top <= height
                : bottom - containerRect.bottom <= height;
        };

        for (let i = 0; i < tabContentTitle.length; i++) {
            if (isVisible(tabContentTitle[i], wrapper)) {
                this.activeTab = tabContentTitle[i].innerText.toLowerCase();
                this.displayActiveTab();
                break;
            }
        }
    }

    public destroy(): void {}
}
