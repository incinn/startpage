import { PluginStorage, SitePlugin } from '../site/plugin';

interface DateSettings {
    showWeekNumber: boolean;
}

export class DisplayDate extends SitePlugin {
    public _name = 'Display Date';
    public _refresh = true;
    private settings: DateSettings;
    private container: HTMLElement;
    private showWeekNumberInput: HTMLInputElement;
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

        this.showWeekNumberInput = document.getElementById(
            'showWeekNumber'
        ) as HTMLInputElement;

        const storage: PluginStorage<DateSettings> = this.getStorage();
        this.settings = storage.data;

        if (!this.settings) {
            this.settings = {
                showWeekNumber: true,
            };
        }
    }

    public init(): void {
        this.renderDate(new Date());
        this.showWeekNumberInput.checked = this.settings.showWeekNumber;

        this.showWeekNumberInput.addEventListener('change', (e) =>
            this.handleWeekToggle(e)
        );
    }

    private handleWeekToggle(e: any): void {
        this.settings.showWeekNumber = e.target.checked;
        this.setStorage({ lastChange: 0, data: this.settings });
        this.init();
    }

    public onRefresh(): void {
        this.init();
    }

    private renderDate(now: Date) {
        const date = `${this.days[now.getDay()]} ${this.formatDate(
            now.getDate()
        )} ${this.months[now.getMonth()]}`;

        this.container.innerHTML = this.settings.showWeekNumber
            ? date + ` &bull; Week ${this.getWeekNumber(now)}`
            : date;
    }

    private formatDate(number: number): string {
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
