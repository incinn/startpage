import { Greeting } from './greeting.enum';

function setTime(): void {
    const container = document.getElementById('timeContainer');

    function pad(n: number): string | number {
        return n < 10 ? '0' + n : n;
    }

    setInterval(() => {
        const now = new Date();
        container.innerHTML =
            pad(now.getHours()) +
            ':' +
            pad(now.getMinutes()) +
            ':' +
            pad(now.getSeconds());
    }, 1000);
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

welcomeMessage();
setTime();
