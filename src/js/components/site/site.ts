import { Search } from '../search/search';
import { Weather } from '../weather/weather';
import { DisplayDate } from './../date/date';
import { DisplayGreeting } from './../greeting/greeting';
import { DisplayTime } from './../time/time';

export class Site {
    private refreshTimer: any;

    private plugins = [
        new DisplayTime(),
        new DisplayDate(),
        new DisplayGreeting(),
        new Search(),
        new Weather(),
    ];

    constructor() {}

    public init(): void {
        this.plugins.forEach((plugin) => {
            plugin.init();
        });

        console.log('Site ready');

        // 30min refresh timer
        this.refreshTimer = setInterval(() => this.refresh(), 1800000);
    }

    public refresh(): void {
        this.plugins.forEach((plugin) => {
            plugin.refresh();
        });
    }

    public destroy(): void {
        this.plugins.forEach((plugin) => {
            plugin.destroy();
        });

        clearInterval(this.refreshTimer);
    }
}
