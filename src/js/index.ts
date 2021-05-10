import { DisplayDate } from './components/date/date';
import { DisplayTime } from './components/time/time';
import { Greeting } from './greeting.enum';

function displayDate(): void {
    const container = document.getElementById('dateDisplay');
    const now = new Date();
    const months = [
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
    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    function formatDate(number): string {
        var d = number % 10;
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

    container.innerHTML =
        days[now.getDay()] +
        ' ' +
        formatDate(now.getDate()) +
        ' ' +
        months[now.getMonth()];
}

function welcomeMessage(): void {
    const container = document.getElementById('welcomeContainer');
    const now = new Date();

    if (now.getHours() >= 0 && now.getHours() <= 11)
        container.innerHTML = Greeting.morning;
    else if (now.getHours() >= 12 && now.getHours() <= 17)
        container.innerHTML = Greeting.afternoon;
    else if (now.getHours() >= 18) container.innerHTML = Greeting.evening;
}

window.onload = () => {
    const time = new DisplayTime();
    const date = new DisplayDate();

    time.init();
    date.init();
    displayDate();
};
