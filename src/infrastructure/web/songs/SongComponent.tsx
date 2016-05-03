import * as React from 'react';
import {Song as SongModel} from '../../../domain/models/Song';

interface SongComponentProps {
    song: SongModel;
}

export function Song(props: SongComponentProps) {
    return <span>{props.song.title}</span>
}
