export class Song {
    public constructor(private _uuid: string, private _title: string) { }

    set title(title: string) {
        this._title = title;
    }

    get title() {
        return this._title;
    }

    set uuid(uuid: string) {
        this._uuid = uuid;
    }

    get uuid() {
        return this._uuid;
    }
}
