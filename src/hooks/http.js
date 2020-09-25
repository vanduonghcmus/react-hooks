import { useReducer } from "react";

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: action.extra,
        identifier: action.identifier,
      };
    case "RESPONSE":
      return {
        ...currentHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case "CLEAR":
      return { ...currentHttpState, error: null };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    default:
      throw new Error("Should not be reached");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null,
  });
  const sendRequest = (url, method, body, reqExtra, identifier) => {
    dispatchHttp({ type: "SEND", identifier: identifier });
    fetch(url, {
      method: method,
      body: body,
    })
      .then((response) => response.json())
      .then((responseData) => {
        dispatchHttp({ type: "RESPONSE", data: responseData, extra: reqExtra });
      })
      .catch((error) => {
        dispatchHttp({
          type: "ERROR",
          errorMessage: "Some things went wrong!",
        });
      });
  };
  return {
    isLoading: httpState.loading,
    error: httpState.error,
    data: httpState.data,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    sendRequest: sendRequest,
  };
};

export default useHttp;
