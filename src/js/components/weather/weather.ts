export class Weather {
    private container: HTMLElement;
    private icon: any;
    private weatherApi =
        'https://api.openweathermap.org/data/2.5/weather?units=metric';
    private iconUrl = 'http://openweathermap.org/img/wn';
    private apiKey = process.env.OPENWEATHERMAP_API_KEY;
    private weatherCity = process.env.OPENWEATHERMAP_CITY;
    private weatherCountry = process.env.OPENWEATHERMAP_COUNTRY;

    constructor() {
        this.container = document.getElementById('weatherDisplay');
        this.icon = document.getElementById('weatherIcon');
    }

    public init(): void {
        const Http = new XMLHttpRequest();
        Http.open(
            'GET',
            this.weatherApi +
                '&q=' +
                this.weatherCity +
                ',' +
                this.weatherCountry +
                '&appid=' +
                this.apiKey
        );
        Http.send();

        Http.onreadystatechange = (e) => {
            if (Http.readyState === 4) {
                if (Http.status === 200) {
                    var obj = JSON.parse(Http.responseText);
                    console.log('responseText: ', Http.responseText);
                    this.render(JSON.stringify(obj));
                }
            }
        };
    }

    private render(response: string): void {
        const resp = JSON.parse(response);
        if (resp) {
            console.log(resp);
            this.container.innerHTML =
                resp.weather[0].description + ' ' + resp.main.temp + '&deg;C';
            this.icon.src = this.iconUrl + '/' + resp.weather[0].icon + '.png';
        }
    }
}
