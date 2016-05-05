import * as React from 'react';
import {Song as SongModel} from '../../../domain/models/Song';
import { Song } from './SongComponent';
import GridList from 'material-ui/GridList';
require('./songs.css');

interface SongsListsComponentProps {
    songs: SongModel[];
}

export function SongList(props: SongsListsComponentProps) {
    const windowWidht = window.innerWidth;
    let cols = 1;
    if(windowWidht > 480) {
        cols = 2;
    }
    if(windowWidht > 768) {
        cols = 3;
    }
    if(windowWidht > 992) {
        cols = 4;
    }
    if(windowWidht > 1200) {
        cols = 5;
    }
    const songs = props.songs && props.songs.map((song) => {
            return (
                <Song key={song.uuid} song={song} />
            );
        });
    return (
        <GridList cols={cols} style={{ width: 'auto' }}>
                {songs}
        </GridList>
    );
}
