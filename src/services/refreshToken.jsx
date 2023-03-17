import { clearAllSlice, cookies, timeRefreshToken } from "../common/Utility.jsx";
import { setIsRefresh } from "../redux/GeneralSlice.jsx";
import { postToServer } from "./getAPI.jsx";

export const refreshToken = (nav,dispatch) => {
  dispatch(setIsRefresh(true));
  return new Promise((resolve, reject) => {
    postToServer('/v1/auth/refreshToken',{
      refreshToken: cookies.get('refreshToken')
    }).then(result => {
      cookies.remove('accessToken', {path: '/'});
      cookies.remove('refreshToken', {path: '/'});
      const timeRefresh = timeRefreshToken();
      cookies.set('accessToken', result.newAccessToken, { path: '/', domain:process.env.DOMAIN , sameSite: "strict", secure: true });
      cookies.set('refreshToken', result.newRefreshToken, { path: '/', domain:process.env.DOMAIN , sameSite: "strict", expires: timeRefresh, secure: true });
      dispatch(setIsRefresh(false));
      resolve();
    }).catch(error => {
      clearAllSlice(dispatch);
      nav("/login");
      reject(error);
    })
  });
}
 