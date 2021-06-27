import { PluginStorage, SitePlugin } from '../site/plugin';

export interface WeatherDisplayLite {
    description: string;
    temperature: number;
    iconCode: string;
}

export interface WeatherSettings {
    country: string;
    city: string;
    units: WetherTempUnits;
}

export enum WetherTempUnits {
    metric = 'metric',
    imperial = 'imperial',
}

export class Weather extends SitePlugin {
    public _name = 'Display weather';
    public _refresh = true;
    private container: HTMLElement;
    private saveButton: HTMLButtonElement;
    private settings: WeatherSettings;
    private icon: any;
    private weatherApi = 'https://api.openweathermap.org/data/2.5/weather';
    private iconUrl = 'https://openweathermap.org/img/wn/';
    private apiKey = process.env.OPENWEATHERMAP_API_KEY;

    constructor() {
        super();
        this.container = document.getElementById('weatherDisplay');
        this.icon = document.getElementById('weatherIcon');
        this.saveButton = document.getElementById(
            'weatherSave'
        ) as HTMLButtonElement;

        this.settings = this.getStorage()?.data.settings;
        if (!this.settings) {
            this.settings = {
                country: 'GB',
                city: 'London',
                units: WetherTempUnits.metric,
            };
        }
    }

    public init(): void {
        const data: PluginStorage = this.getStorage();
        if (data) {
            const timeSinceSave =
                new Date().valueOf() - new Date(data.lastChange).valueOf();

            // 15min check
            timeSinceSave >= 900000
                ? this.getLatest()
                : this.render(data.data.weather);
        } else {
            this.getLatest();
        }

        this.saveButton.addEventListener('click', () =>
            this.handleSaveButton()
        );
    }

    public onRefresh(): void {
        this.getLatest();
    }

    private getLatest(): void {
        const request = new XMLHttpRequest();

        request.open(
            'GET',
            `${this.weatherApi}?q=${this.settings.city},${this.settings.country}&units=${this.settings.units}&appid=${this.apiKey}`
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
                this.setStorage({
                    lastChange: 0,
                    data: {
                        weather: weather,
                        settings: this.settings,
                    },
                });
            }
        };

        request.onerror = () => {
            console.error('Failed fetching weather data');
        };
    }

    private render(weather: WeatherDisplayLite): void {
        if (weather) {
            const tempUnit =
                this.settings.units === WetherTempUnits.metric ? 'C' : 'F';
            this.container.innerHTML = `${weather.description} &bull; ${weather.temperature}&deg;${tempUnit}`;
            this.icon.src = this.iconUrl + weather.iconCode + '.png';
        }
    }

    private handleSaveButton(): void {
        const countryEl = document.getElementById(
            'weatherCountry'
        ) as HTMLSelectElement;
        const cityEl = document.getElementById(
            'weatherCity'
        ) as HTMLInputElement;
        const country = this.cleanString(countryEl.value);
        const city = this.cleanString(cityEl.value);

        if (country === this.settings.country && city === this.settings.city) {
            return;
        }

        this.settings.country = country;
        this.settings.city = city;

        this.getLatest();
    }

    private cleanString(a: string): string {
        return a.replace(/[^a-zA-Z ]/gi, '');
    }
}
