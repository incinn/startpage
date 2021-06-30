import { capitalizeFirstLetter } from '../../helpers/text';
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
    private resetButton: HTMLButtonElement;
    private countryEl: HTMLSelectElement;
    private cityEl: HTMLInputElement;
    private weatherInfoEl: HTMLElement;
    private weatherDisplayWrapper: HTMLElement;
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
        this.resetButton = document.getElementById(
            'weatherReset'
        ) as HTMLButtonElement;
        this.countryEl = document.getElementById(
            'weatherCountry'
        ) as HTMLSelectElement;
        this.cityEl = document.getElementById(
            'weatherCity'
        ) as HTMLInputElement;
        this.weatherInfoEl = document.getElementById('weatherInfo');
        this.weatherDisplayWrapper = document.getElementById(
            'weatherDisplayWrapper'
        );

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
                ? this.setWeather()
                : this.render(data.data.weather);
        } else {
            this.setWeather();
        }

        this.saveButton.addEventListener('click', () =>
            this.handleSaveButton()
        );

        this.resetButton.addEventListener('click', () => {
            this.handleResetButton();
        });

        this.updateSettingsValues();
    }

    public onRefresh(): void {
        this.setWeather();
    }

    private updateSettingsValues(): void {
        if (this.cityEl && this.countryEl) {
            this.cityEl.value = this.settings.city;
            this.countryEl.value = this.settings.country;
        }
    }

    private setWeather(): void {
        const weather = this.queryWeather();

        weather
            .then((weather) => {
                this.render(weather);
                this.updateStorage(weather);
            })
            .catch((e) => {
                console.error(e);
            });
    }

    private updateStorage(data: WeatherDisplayLite): void {
        this.setStorage({
            lastChange: 0,
            data: {
                weather: data,
                settings: this.settings,
            },
        });
    }

    private queryWeather(
        settings?: WeatherSettings
    ): Promise<WeatherDisplayLite | null> {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            let query: string;

            if (settings) {
                query = `${this.weatherApi}?q=${settings.city},${settings.country}&units=${settings.units}&appid=${this.apiKey}`;
            } else {
                query = `${this.weatherApi}?q=${this.settings.city},${this.settings.country}&units=${this.settings.units}&appid=${this.apiKey}`;
            }

            request.open('GET', query);
            request.send();

            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        const resp = JSON.parse(request.responseText);
                        const weather: WeatherDisplayLite = {
                            description: resp.weather[0].description,
                            temperature: resp.main.temp as number,
                            iconCode: resp.weather[0].icon,
                        };

                        resolve(weather);
                    } else {
                        reject('Invalid location');
                    }
                }
            };

            request.onerror = () => {
                reject('Error fetching weather');
            };
        });
    }

    private render(weather: WeatherDisplayLite): void {
        if (weather) {
            const tempUnit =
                this.settings.units === WetherTempUnits.metric ? 'C' : 'F';
            this.container.innerHTML = `${weather.description} &bull; ${weather.temperature}&deg;${tempUnit}`;
            this.icon.src = this.iconUrl + weather.iconCode + '.png';
            this.weatherDisplayWrapper.title = `${this.settings.city}, ${this.settings.country}`;
        }
    }

    // todo: debounce to prevent spam
    private handleSaveButton(): void {
        this.cityEl.classList.remove('error');

        const country = this.cleanString(this.countryEl.value);
        const city = capitalizeFirstLetter(this.cleanString(this.cityEl.value));

        if (country === this.settings.country && city === this.settings.city) {
            return;
        }

        const weather = this.queryWeather({
            country,
            city,
            units: this.settings.units,
        });

        weather
            .then((weather) => {
                this.settings.country = country;
                this.settings.city = city;

                this.updateInfoText(true, 'Location updated');
                this.render(weather);
                this.updateStorage(weather);

                setTimeout(() => {
                    this.handleResetButton();
                }, 2000);
            })
            .catch((e) => {
                console.error(e);
                this.updateInfoText(false, e);
                this.cityEl.classList.add('error');
            });
    }

    private handleResetButton(): void {
        this.countryEl.value = this.settings.country;

        this.cityEl.value = this.settings.city;
        this.cityEl.classList.remove('error');

        this.weatherInfoEl.classList.remove('error');
        this.weatherInfoEl.classList.remove('success');
        this.weatherInfoEl.innerHTML = '';
    }

    private updateInfoText(success: boolean, text: string): void {
        this.weatherInfoEl.classList.remove('error');
        this.weatherInfoEl.classList.remove('success');
        this.weatherInfoEl.classList.add(success ? 'success' : 'error');
        this.weatherInfoEl.innerHTML = text;
    }

    private cleanString(a: string): string {
        return a.replace(/[^a-zA-Z ]/gi, '');
    }
}
