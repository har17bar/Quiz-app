import axsios from "axios";
import { AUTH_LOGOUT, AUTH_SUCCESS } from "./actionTypes";

function authSuccess(token) {
  return {
    type: AUTH_SUCCESS,
    token
  };
}
function logOut() {
  return {
    type: AUTH_LOGOUT
  };
}
function autoLogout(time) {
  return dispatch => {
    setTimeout(() => {
      dispatch(logOut());
    }, time * 1000);
  };
}

export function auth(email, password, isLogin) {
  return async dispatch => {
    const apiKey = "AIzaSyCwb2wmaKLnkCRkujldO1jpWC0fFC9gYMA";
    const authData = {
      email,
      password,
      returnSecureToken: true
    };
    let url = "";
    if (isLogin) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
    }
    const response = await axsios.post(url, authData);
    const data = response.data;
    const expirationDate = new Date(
      new Date().getTime() + data.expiresIn * 1000
    );
    console.log(data, "___)_");
    localStorage.setItem("token", data.idToken);
    localStorage.setItem("userId", data.localId);
    localStorage.setItem("expirationDate", expirationDate);

    dispatch(authSuccess(data.idToken));
    dispatch(autoLogout(data.expiresIn));
  };
}
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("expirationDate");
  return {
    type: AUTH_LOGOUT
  };
}

export function autoLogin() {
  return dispatch => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logOut());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logOut());
      } else {
        dispatch(authSuccess(token));
        dispatch(
          autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000)
        );
      }
    }
  };
}
