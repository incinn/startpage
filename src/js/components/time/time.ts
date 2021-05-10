export class DisplayTime {
    private container: HTMLElement;
    private timer: any;

    constructor() {
        this.container = document.getElementById('timeContainer');

        if (!this.container) {
            console.error('Unable to find timeContainer');
            this.init = () => {};
        }
    }

    public init(): void {
        this.setTime();
        this.timer = setInterval(() => this.setTime(), 1000);
    }

    public destroy(): void {
        clearInterval(this.timer);
    }

    private pad(n: number): number {
        return <number>(n < 10 ? '0' + n : n);
    }

    private setTime(): void {
        const now = new Date();
        this.container.innerHTML =
            this.pad(now.getHours()) +
            ':' +
            this.pad(now.getMinutes()) +
            ':' +
            this.pad(now.getSeconds());
    }
}
