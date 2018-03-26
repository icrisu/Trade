import { OPEN_MENU } from '../actions/types';

export default (state = { isOpen: true, type: 'desktop' }, action) => {
    switch (action.type) {
        case OPEN_MENU:
            return action.payload;
        default:
            return state;
    }
}
