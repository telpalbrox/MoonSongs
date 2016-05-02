import * as React from 'react';
import { connect } from 'react-redux';
import {MoonSongsState} from "../MoonSongs";
import {PaginatedState} from "../common/reducers/paginate";
import {Song} from "../../../domain/models/Song";
import { getSongs } from '../songs/songsActions';

interface SongsProps extends PaginatedState {
    songs: Song[];
    dispatch: Function;
}

class SongsContainer extends React.Component<SongsProps, any> {

    static mapStateToProps(state: MoonSongsState) {
        const { pageCount, songs, total, loading } = state.songs;
        return { pageCount, songs, total, loading };
    }

    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.renderSongs = this.renderSongs.bind(this);
    }

    renderSongs() {
        if(!this.props.songs) {
            return;
        }
        return this.props.songs.map((song) => {
            return (
                <li>{song.title}</li>
            );
        });
    }

    componentDidMount() {
        this.props.dispatch(getSongs());
    }
    
    render() {
        return (
            <div>
                <h2>Songs</h2>
                <ul>
                    { this.renderSongs() }
                </ul>
            </div>
        );
    }
}

export default connect(SongsContainer.mapStateToProps)(SongsContainer);
