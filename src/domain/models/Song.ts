export class Song {
    public constructor (
        private _uuid: string,
        private _title: string,
        private _album: string,
        private _artist: string,
        private _relativePath: string
    ) { }

    toPlainObject() {
        return {
            uuid: this.uuid,
            title: this.title,
            album: this.album,
            artist: this.artist,
            relativePath: this.relativePath
        }
    }
    
    toJSON() {
        return {
            uuid: this.uuid,
            title: this.title,
            album: this.album,
            artist: this.artist,
            url: this.url
        }
    }
    
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
    
    set relativePath(relativePath) {
        this._relativePath = relativePath;
    }
    
    get relativePath() {
        return this._relativePath;
    }
    
    set album(album: string) {
        this._album = album;
    }
    
    get album() {
        return this._album;
    }
    
    set artist(artist: string) {
        this._artist = artist;
    }
    
    get artist() {
        return this._artist;
    }
    
    get url(): string {
        return `${this.uuid}/listen`;
    }
}
