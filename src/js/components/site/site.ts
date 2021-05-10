import { Search } from '../search/search';
import { Weather } from '../weather/weather';
import { DisplayDate } from './../date/date';
import { DisplayGreeting } from './../greeting/greeting';
import { DisplayTime } from './../time/time';

export class Site {
    private time: DisplayTime;
    private date: DisplayDate;
    private greeting: DisplayGreeting;
    private search: Search;
    private weather: Weather;

    constructor() {
        this.time = new DisplayTime();
        this.date = new DisplayDate();
        this.greeting = new DisplayGreeting();
        this.search = new Search();
        this.weather = new Weather();
    }

    public init(): void {
        this.time.init();
        this.date.init();
        this.greeting.init();
        this.search.init();
        this.weather.init();
    }
}
