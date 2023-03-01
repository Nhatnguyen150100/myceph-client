import { clearAllSclice, cookies } from "../common/Utility.jsx";
import { setIsRefresh } from "../redux/GeneralSlice.jsx";
import { postToServer } from "./getAPI.jsx";

export const refreshToken = (nav,dispatch) => {
  dispatch(setIsRefresh(true));
  cookies.remove('accessToken', {path: '/'});
  return new Promise((resolve, reject) => {
    // dispatch(setIsRefresh(true));
    postToServer('/v1/auth/refreshToken',{
      refreshToken: cookies.get('refreshToken')
    }).then(result => {
      cookies.set('accessToken', result.newAccessToken, { path: '/', sameSite: true, secure: true });
      cookies.set('refreshToken', result.newRefreshToken, { path: '/', sameSite: true, secure: true });
      dispatch(setIsRefresh(false));
      resolve();
    }).catch(error => {
      clearAllSclice(dispatch);
      nav("/login");
      reject(error);
    })
  });
}
 