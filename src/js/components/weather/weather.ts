import { PluginStorage, SitePlugin } from '../site/plugin';

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
        const data: PluginStorage = this.getStorage();
        if (data) {
            const timeSinceSave =
                new Date().valueOf() - new Date(data.lastChange).valueOf();

            // 15min check
            timeSinceSave >= 900000 ? this.getLatest() : this.render(data.data);
        } else {
            this.getLatest();
        }
    }

    public onRefresh(): void {
        this.getLatest();
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

        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                const resp = JSON.parse(request.responseText);
                const weather: WeatherDisplayLite = {
                    description: resp.weather[0].description,
                    temperature: resp.main.temp as number,
                    iconCode: resp.weather[0].icon,
                };

                this.render(weather);
                this.setStorage({ lastChange: 0, data: weather });
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
