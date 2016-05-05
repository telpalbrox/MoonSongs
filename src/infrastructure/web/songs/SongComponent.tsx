import * as React from 'react';
import { GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import {Song as SongModel} from '../../../domain/models/Song';

interface SongComponentProps {
    song: SongModel;
}

export function Song(props: SongComponentProps) {
    return (
        <GridTile
            cols={1}
            style={{ width: 'auto' }}
            title={props.song.title}
            subtitle={props.song.artist}
            actionIcon={<IconButton tooltip="Play" tooltipPosition="top-left" touch={true} iconClassName="material-icons">play_arrow</IconButton>}
        >
            <img src="http://placehold.it/350x350"/>
        </GridTile>
    );
}
