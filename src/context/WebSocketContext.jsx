import React, { createContext, useState, useContext, useEffect } from 'react';

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    // Initialize state from sessionStorage
    const [name, setName] = useState(() => sessionStorage.getItem('name') || null);
    const [wsToken, setWsToken] = useState(() => sessionStorage.getItem('wsToken') || null);

    // Effect to synchronize state with sessionStorage
    useEffect(() => {
        if (name) {
            sessionStorage.setItem('name', name);
        } else {
            sessionStorage.removeItem('name');
        }
    }, [name]);

    useEffect(() => {
        if (wsToken) {
            sessionStorage.setItem('wsToken', wsToken);
        } else {
            sessionStorage.removeItem('wsToken');
        }
    }, [wsToken]);

    return (
        <WebSocketContext.Provider value={{ name, setName, wsToken, setWsToken }}>
            {children}
        </WebSocketContext.Provider>
    );
};