import { SitePlugin } from '../site/plugin';

export interface WeatherDisplayLite {
    description: string;
    temperature: number;
    iconCode: string;
}

export class Weather extends SitePlugin {
    public _name = 'Display weather';
    public _refresh = true;
    private container: HTMLElement;
    private icon: any;
    private weatherApi =
        'https://api.openweathermap.org/data/2.5/weather?units=metric';
    private iconUrl = 'https://openweathermap.org/img/wn/';
    private apiKey = process.env.OPENWEATHERMAP_API_KEY;
    private weatherCity = process.env.OPENWEATHERMAP_CITY;
    private weatherCountry = process.env.OPENWEATHERMAP_COUNTRY;

    constructor() {
        super();
        this.container = document.getElementById('weatherDisplay');
        this.icon = document.getElementById('weatherIcon');
    }

    public init(): void {
        this.getLatest();
    }

    public onRefresh(): void {
        this.init();
    }

    private getLatest(): void {
        const request = new XMLHttpRequest();
        request.open(
            'GET',
            this.weatherApi +
                '&q=' +
                this.weatherCity +
                ',' +
                this.weatherCountry +
                '&appid=' +
                this.apiKey
        );
        request.send();

        request.onreadystatechange = (e) => {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    const resp = JSON.parse(request.responseText);
                    const weather: WeatherDisplayLite = {
                        description: resp.weather[0].description,
                        temperature: resp.main.temp as number,
                        iconCode: resp.weather[0].icon,
                    };

                    this.render(weather);
                }
            }
        };
    }

    private render(weather: WeatherDisplayLite): void {
        if (weather) {
            this.container.innerHTML = `${weather.description} &bull; ${weather.temperature}&deg;C`;
            this.icon.src = this.iconUrl + weather.iconCode + '.png';
        }
    }
}
