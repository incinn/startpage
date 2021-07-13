export interface PluginStorage<T> {
    lastChange: number;
    data: T;
}

export class SitePlugin {
    public _name = 'Plugin';
    public _refresh = false;

    constructor() {}

    public init(): void {
        throw new Error(`${this._name} not yet implemented`);
    }

    public refresh(): void {
        if (this._refresh) {
            const now = new Date();
            console.info(
                `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] Refreshing ${
                    this._name
                }`
            );
            this.onRefresh();
        }
    }

    public onRefresh(): void {}

    public getStorage(): PluginStorage<any> {
        const emptyStorage: PluginStorage<null> = {
            lastChange: 0,
            data: null,
        };

        try {
            if (window.localStorage.getItem(this._name) === null) {
                return emptyStorage;
            } else {
                return JSON.parse(window.localStorage.getItem(this._name));
            }
        } catch (error) {
            console.error(error);
            return emptyStorage;
        }
    }

    public readGlobalConfig(): any {
        return JSON.parse(window.localStorage.getItem('settings'));
    }

    public setStorage(data: PluginStorage<any>): void {
        data.lastChange = new Date().valueOf();
        window.localStorage.setItem(this._name, JSON.stringify(data));
    }

    public destroyStorage(): void {
        window.localStorage.removeItem(this._name);
    }

    public destroy(): void {}
}
