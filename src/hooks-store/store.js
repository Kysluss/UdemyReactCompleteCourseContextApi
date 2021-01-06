import { useState, useEffect } from 'react';

let globalState = {};
let listeners = [];
let actions = {};

export const useStore = (shouldListen = true) => {
    const setState = useState(globalState)[1];

    const dispatch = (actionIdentifier, payload) => {
        // Similar to redux
        // We dispatch an action which returns new state
        const newState = actions[actionIdentifier](globalState, payload);

        // Merge the new state with our global state
        globalState = {...globalState, ...newState};

        // Alert the listeners of the newly created state
        for(const listener of listeners) {
            listener(globalState);
        }
    };

    useEffect(() => {
        if(shouldListen) {
            // Component has mounted, so register the setState listener
            listeners.push(setState);
        }

        // Remove the listener when the component unmounts
        return () => {
            if(shouldListen) {
                listeners = listeners.filter(l => l !== setState);
            }
        };
    }, [setState, shouldListen]);

    return [globalState, dispatch];
};

export const initStore = (userActions, initialState) => {
    if(initialState) {
        globalState = {...globalState, ...initialState};
    }

    actions = {...actions, ...userActions};
};