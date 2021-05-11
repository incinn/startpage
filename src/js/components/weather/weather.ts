export class Weather {
    private container: HTMLElement;
    private icon: any;
    private weatherApi =
        'https://api.openweathermap.org/data/2.5/weather?units=metric';
    private iconUrl = 'http://openweathermap.org/img/wn/';
    private apiKey = process.env.OPENWEATHERMAP_API_KEY;
    private weatherCity = process.env.OPENWEATHERMAP_CITY;
    private weatherCountry = process.env.OPENWEATHERMAP_COUNTRY;

    constructor() {
        this.container = document.getElementById('weatherDisplay');
        this.icon = document.getElementById('weatherIcon');
    }

    public init(): void {
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
                    this.render(request.responseText);
                }
            }
        };
    }

    private render(response: string): void {
        const resp = JSON.parse(response);
        if (resp) {
            this.container.innerHTML =
                resp.weather[0].description +
                ' &bull; ' +
                resp.main.temp +
                '&deg;C';
            this.icon.src = this.iconUrl + resp.weather[0].icon + '.png';
        }
    }
}
