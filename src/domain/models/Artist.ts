export class Artist {
    public constructor(private _uuid: string, private _name: string) { }

    set name(name: string) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set uuid(uuid: string) {
        this._uuid = uuid;
    }

    get uuid() {
        return this._uuid;
    }
}
