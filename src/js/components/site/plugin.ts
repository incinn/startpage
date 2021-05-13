export interface PluginStorage {
    lastChange: number;
    data: any;
}

export class SitePlugin {
    public _name = 'Blank Plugin';
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

    public getStorage(): PluginStorage {
        try {
            return JSON.parse(window.localStorage.getItem(this._name));
        } catch (error) {
            return null;
        }
    }

    public readGlobalConfig(): any {
        return JSON.parse(window.localStorage.getItem('settings'));
    }

    public setStorage(data: PluginStorage): void {
        data.lastChange = new Date().getTime();
        window.localStorage.setItem(this._name, JSON.stringify(data));
    }

    public destroy(): void {}
}
