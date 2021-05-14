import { Search } from '../search/search';
import { DisplaySettings } from '../settings/settings';
import { DisplayTheme } from '../theme/theme';
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
        new DisplaySettings(),
        new DisplayTheme(),
    ];

    constructor() {}

    public init(): void {
        this.plugins.forEach((plugin) => {
            plugin.init();
        });

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
