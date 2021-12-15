import React, { createContext, useReducer } from "react";

const reducer = (state, action) => {
    switch (action.type) {
        case "TOGGLE_FORCE_UPDATE":
            return {
                ...state,
                forceUpdate: !state.forceUpdate,
            };
        default:
            return state;
    }
}

const initialState = {
    forceUpdate: false,
}

const Store = ({ children }) => {
    const [storeState, storeDispatch] = useReducer(reducer, initialState);

    return (
        <Context.Provider value={[storeState, storeDispatch]}>
            { children }
        </Context.Provider>
    )
}

export const Context = createContext(initialState);
export default Store;