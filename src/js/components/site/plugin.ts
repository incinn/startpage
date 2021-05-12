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

    public destroy(): void {}
}
