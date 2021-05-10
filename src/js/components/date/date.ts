export class DisplayDate {
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
        this.container = document.getElementById('dateDisplay');

        if (!this.container) {
            console.error('Unable to find dateDisplay');
            this.init = () => {};
        }
    }

    public init(): void {
        const now = new Date();

        this.container.innerHTML =
            this.days[now.getDay()] +
            ' ' +
            this.formatDate(now.getDate()) +
            ' ' +
            this.months[now.getMonth()];
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
}
