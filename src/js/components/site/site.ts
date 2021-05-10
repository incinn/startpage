import { Search } from '../search/search';
import { DisplayDate } from './../date/date';
import { DisplayGreeting } from './../greeting/greeting';
import { DisplayTime } from './../time/time';

export class Site {
    private time: DisplayTime;
    private date: DisplayDate;
    private greeting: DisplayGreeting;
    private search: Search;

    constructor() {
        this.time = new DisplayTime();
        this.date = new DisplayDate();
        this.greeting = new DisplayGreeting();
        this.search = new Search();
    }

    public init(): void {
        this.time.init();
        this.date.init();
        this.greeting.init();
        this.search.init();
    }
}
