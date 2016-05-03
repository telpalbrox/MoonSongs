// Paginate reducer factory
import Reducer = Redux.Reducer;

export interface PaginatedState {
    loading: boolean;
    total: number;
    pageCount: number;
    limit: number;
}

export default function paginate<T>({ types, dataKey }: { types: [string, string, string], dataKey: string }): Reducer {

    const [ requestType, successType, failureType ] = types;

    const initialState = {
        loading: false,
        nextPageUrl: undefined,
        pageCount: 0,
        total: 0,
        limit: 0
    };

    return function updatePaginationByKey(state = initialState, action) {
        switch (action.type) {
            case requestType:
                return Object.assign({}, state, { loading: true });
            case successType:
                return Object.assign({}, state, {
                    loading: false,
                    [dataKey]: action[dataKey],
                    page: action.page,
                    total: action.total
                });
            case failureType:
                return Object.assign({}, state, { loading: false });
            default:
                return state;
        }
    }
}
