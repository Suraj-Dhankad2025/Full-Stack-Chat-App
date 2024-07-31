import { useSetRecoilState } from 'recoil';
import { authState } from './atoms';

const useAuthState = () => {
  const setUserAuth = useSetRecoilState(authState);

  const userExists = (data) => {
    setUserAuth(prevState => ({
      ...prevState,
      user: data,
      loader: false,
    }));
  };

  const userNotExists = () => {
    setUserAuth(prevState => ({
      ...prevState,
      user: null,
      loader: false,
    }));
  };

  return { userExists, userNotExists };
};

export default useAuthState;