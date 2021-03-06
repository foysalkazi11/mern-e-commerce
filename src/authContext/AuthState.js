import React, { createContext, useContext, useReducer, useEffect } from "react";
import authReducer from "./authReducer";
import axiosConfig from "../config/axiosConfig";
import { CHECK_USER, ERROR_USER, CLEAR_ERROR, RESET_LOADING } from "./type";
const AuthContext = createContext();

const AuthState = ({ children }) => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    message: "",
    isLoading: false,
    isError: false,
    errorMessage: ""
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  //call first time render
  useEffect(() => {
    checkUser();
  }, []);

  //register user
  const registerUser = async (inputs) => {
    dispatch({ type: RESET_LOADING });
    const url = "/user/register";
    try {
      const res = await axiosConfig.post(url, inputs);
      dispatch({ type: CHECK_USER, payload: res.data });
    } catch (error) {
      dispatch({ type: ERROR_USER, payload: error.response.data.message });
    }
  };

  //login user
  const loginUser = async (formData) => {
    dispatch({ type: RESET_LOADING });
    const url = "/user/login";
    try {
      const res = await axiosConfig.post(url, formData);
      dispatch({ type: CHECK_USER, payload: res.data });
    } catch (error) {
      dispatch({ type: ERROR_USER, payload: error.response.data.message });
    }
  };

  //logout user
  const logoutUser = async () => {
    dispatch({ type: RESET_LOADING });
    const url = "/user/logout";
    try {
      const res = await axiosConfig(url);
      dispatch({ type: CHECK_USER, payload: res.data });
    } catch (error) {
      dispatch({ type: ERROR_USER, payload: error.response.data.message });
    }
  };

  //clear error
  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  //check user is authenticated
  const checkUser = async () => {
    const url = "/user/authenticated";
    try {
      const res = await axiosConfig(url);

      dispatch({ type: CHECK_USER, payload: res.data });
    } catch (error) {
      dispatch({ type: CLEAR_ERROR });
      // dispatch({ type: ERROR_USER, payload: error.response.data.message });
    }
  };

  //
  return (
    <AuthContext.Provider
      value={{
        ...state,
        registerUser,
        loginUser,
        logoutUser,
        checkUser,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthState, useAuth };
