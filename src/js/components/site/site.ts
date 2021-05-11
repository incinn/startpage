import { Search } from '../search/search';
import { Weather } from '../weather/weather';
import { DisplayDate } from './../date/date';
import { DisplayGreeting } from './../greeting/greeting';
import { DisplayTime } from './../time/time';

export class Site {
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
    }
}
