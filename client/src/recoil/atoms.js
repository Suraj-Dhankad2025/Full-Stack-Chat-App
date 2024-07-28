import atom from 'recoil';

export const authState = atom({
    key: 'authState',
    default: {
        user: null,
        isAdmin: false,
        loader: true,  
    },
});
