import { DisplayDate } from './components/date/date';
import { DisplayGreeting } from './components/greeting/greeting';
import { DisplayTime } from './components/time/time';

window.onload = () => {
    const time = new DisplayTime();
    const date = new DisplayDate();
    const greeting = new DisplayGreeting();

    time.init();
    date.init();
    greeting.init();
};
