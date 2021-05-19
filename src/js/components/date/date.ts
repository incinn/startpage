import { SitePlugin } from '../site/plugin';

export class DisplayDate extends SitePlugin {
    public _name = 'Display Date';
    public _refresh = true;
    private container: HTMLElement;
    private months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    private days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    constructor() {
        super();
        this.container = document.getElementById('dateDisplay');
        if (!this.container) {
            console.error('Unable to find dateDisplay');
            this.init = () => {};
        }
    }

    public init(): void {
        this.renderDate(new Date());
    }

    public onRefresh(): void {
        this.init();
    }

    private renderDate(now: Date) {
        this.container.innerHTML = `${
            this.days[now.getDay()]
        } ${this.formatDate(now.getDate())} ${
            this.months[now.getMonth()]
        } &bull; Week ${this.getWeekNumber(now)}`;
    }

    private formatDate(number): string {
        const d = number % 10;
        return ~~((number % 100) / 10) === 1
            ? number + 'th'
            : d === 1
            ? number + 'st'
            : d === 2
            ? number + 'nd'
            : d === 3
            ? number + 'rd'
            : number + 'th';
    }

    private getWeekNumber(date: Date): number {
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
        const weekOne = new Date(date.getFullYear(), 0, 4);
        return (
            1 +
            Math.round(
                ((date.getTime() - weekOne.getTime()) / 86400000 -
                    3 +
                    ((weekOne.getDay() + 6) % 7)) /
                    7
            )
        );
    }
}
