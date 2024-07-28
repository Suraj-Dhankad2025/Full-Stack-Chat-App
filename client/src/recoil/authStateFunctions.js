import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { authState } from './atoms';

export const userExists = (action) => {
    authState.user = action.payload;
    authState.loader = false;
}

export const userNotExists = () => {
    authState.user = null;
    authState.loader = false;
}