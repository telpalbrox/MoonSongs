import * as React from 'react';
import {Song as SongModel} from '../../../domain/models/Song';
import { Song } from './SongComponent';

interface SongsListsComponentProps {
    songs: SongModel[];
}

export function SongList(props: SongsListsComponentProps) {
    const songs = props.songs && props.songs.map((song) => {
        return (
            <li key={song.uuid}><Song song={song} /></li>
        );
    });
    return (
        <ul>
            {songs}
        </ul>
    );
}
