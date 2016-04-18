import {SongScanner} from "../../domain/SongScanner";
import {Song} from "../../domain/models/Song";
import {resolve as pathResolve, extname} from "path";
const walk: any = require('walk');
const jsmediatags = require("jsmediatags");

function fileHandler(songs: Song[]) {
    return function(root, fileStat, next) {
        if(extname(fileStat.name) === '.mp3') {
            const songPath = pathResolve(root, fileStat.name);
            jsmediatags.read(songPath, {
                onSuccess(tag) {
                    const tags: any = tag.tags;
                    songs.push(new Song(undefined, tags.title, tags.album, tags.artist, songPath));
                    next();
                },
                onError(err) {
                    console.error(err);
                    next();
                }
            });   
        } else {
            next();
        }
    }
}

const fileSongScanner: SongScanner = (path: string): Promise<Song[]> => {
    return new Promise<Song[]>((resolve) => {
        const songs: Song[] = [];
        const walker = walk.walk(pathResolve(__dirname, path));
        console.log(pathResolve(process.cwd(), path));
        walker.on('file', fileHandler(songs));
        walker.on('end', () => {
            resolve(songs);
        });
    });
};

export { fileSongScanner };
