import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { BsChatSquareHeart } from 'react-icons/bs';
import { MdNetworkCheck, MdSend } from 'react-icons/md';
import { API } from '../pages/Home';
import toast, { Toaster } from 'react-hot-toast';

const ErrorModal = ({ message, onClose }) => (
    <div className="fixed h-full inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-50">
        <div className="relative bg-white overflow-x-hidden px-4 lg:px-6 py-6 rounded-lg w-[90%] lg:w-1/2 max-lg:mt-5">
            <h2 className="text-xl font-semibold mb-4">Error</h2>
            <p className="max-md:text-xs h-full flex flex-col flex-wrap">{message}</p>
            <div className="mt-4 flex justify-end">
                <button onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded-lg">Close</button>
            </div>
        </div>
    </div>
);

const ChatPage = () => {
    const { wsToken } = useWebSocket();
    const [ws, setWs] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [networkLost, setNetworkLost] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (wsToken) {
            const socket = new WebSocket(`${API}/planner/ws/${wsToken}`);

            socket.onopen = () => {
                setIsConnected(true);
                console.log('Connected to WebSocket');
                setWs(socket);
                setNetworkLost(true);
            };

            socket.onmessage = (event) => {
                try {
                    let data;

                    // Handle non-JSON messages
                    const rawMessage = event.data;
                    
                    // Check if the message contains an error
                    const errorMatch = rawMessage.match(/'error':.*?message': '(.*?)'/);
                    if (errorMatch) {
                        // Extract error message
                        const errorMessage = errorMatch[1] || "An error occurred.";
                        setErrorMessage(errorMessage);
                        setHasError(true);
                        return; // Stop further processing for error messages
                    }

                    // Handle valid JSON messages
                    try {
                        // Replace single quotes with double quotes to make it valid JSON
                        const jsonString = rawMessage.replace(/'/g, '"');
                        data = JSON.parse(jsonString);

                        // Check for specific errors
                        if (data.error) {
                            const errorMessage = data.error.message || "An error occurred.";
                            toast.error(errorMessage);
                            setHasError(true);
                        } else {
                            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: jsonString }]);
                            setHasError(false);
                        }
                    } catch (parseError) {
                        // Handle invalid JSON
                        // console.error('Invalid JSON message:', rawMessage);
                        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: rawMessage }]);
                    }
                } catch (error) {
                    toast.error("Failed to process the message.");
                    console.error('Error parsing message:', error);
                }
            };

            socket.onclose = () => {
                if (isConnected) {
                    setNetworkLost(true); // Only show network lost if previously connected
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { sender: 'bot', text: 'Network connection closed.' },
                    ]);
                }
                setIsConnected(false);
            };

            return () => socket.close();
        }
    }, [wsToken]);
    

    const sendMessage = () => {
        if (ws && isConnected && userMessage && !hasError) {
            ws.send(userMessage);
            setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: userMessage }]);
            setUserMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!isConnected && !networkLost) {
        return <div className='w-full h-screen flex items-center justify-center'>
                <div className='flex flex-col gap-2'>
                    {wsToken === null ?
                    <>
                    <MdNetworkCheck size={150} className='mx-auto text-primary-black' />
                    <p>Session expired...</p>
                    <a href="/" className='py-3 px-9 bg-primary-black text-white text-center rounded-xl'>
                    Login
                    </a>
                    </> :
                
                    <>
                    <BsChatSquareHeart size={60} className='mx-auto text-[#00BDD6] animate-pulse' />
                    <p>Loading chat...</p>
                    </> 

                }
                </div>

            </div>;
    }

    return (
        <div className='relative w-full h-full overflow-x-hidden overflow-y-auto max-lg:px-1 lg:pl-4 pt-2'>
            <div className="chat-messages w-full overflow-x-hidden">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === 'bot' ? 
                    'message-bot w-fit lg:w-[50%] p-4 my-2 text-black border rounded-lg' 
                    : 
                    'message-user w-fit lg:w-[50%] p-4 ml-auto mr-1 my-2 bg-[#00BDD61A] rounded-lg'}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="z-[2] fixed flex items-center justify-center right-1 lg:right-2 bottom-0 w-[98%] lg:w-[82%] mx-auto">
                <div className={`relative w-full lg:w-[80%] h-fit mb-2 bg-white
                    border border-[#00BDD6] shadow-[#00BDD6] shadow-lg ${hasError ? 'opacity-20 cursor-not-allowed' : ''}`}>
                    <input
                        type="text"
                        value={userMessage}
                        onKeyDown={handleKeyPress}
                        onChange={(e) => setUserMessage(e.target.value)}
                        placeholder="Type your message..."
                        className='w-[90%] p-3 outline-none bg-transparent'
                        disabled={hasError} // Disable input if there is an error
                    />
                    <button
                        onClick={sendMessage}
                        className='absolute right-2 top-[15%]'
                        disabled={hasError} // Disable button if there is an error
                    >
                        <MdSend size={30} className='text-[#00BDD6]' />
                    </button>
                </div>
            </div>

            {hasError && (
                <ErrorModal 
                    message={errorMessage} 
                    onClose={() => setHasError(false)} 
                />
            )}
        </div>
    );
};

export default ChatPage;