export class SitePlugin {
    public _name = 'Blank Plugin';

    constructor() {}

    public init(): void {
        throw new Error(`${this._name} not yet implemented`);
    }
}
