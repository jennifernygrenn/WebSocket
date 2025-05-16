import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import ChatRoom from './ChatRoom';
import ChatBox from './ChatBox';

const ChatHome = () => {
    const [connection, setConnection] = useState(null);
    const [usermessages, setUserMessages] = useState([]);
    const [userName, setUserName] = useState('');
    const [chatRoom, setChatRoom] = useState('');
	const [role, setRole] = useState(''); // la till roll här
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (connection) {
            connection.on("ReceiveMessage", (role, user, message) => {
                setUserMessages(prevMessages => [...prevMessages, { role, user, message }]);
            }); // och här

            connection.onclose(() => {
                console.log("Connection closed");
            });
        }
    }, [connection]);

    const joinChatRoom = async (role, userName, chatRoom) => {
        setLoading(true);
        const connection = new HubConnectionBuilder()
            .withUrl("http://localhost:5170/chatHub")//replce your backend Url
            .configureLogging(LogLevel.Information)
            .build();

			try {
				await connection.start();
				await connection.invoke("JoinChatRoom", role, userName, chatRoom);
				setConnection(connection);
			} catch (error) {
				console.error("Anslutningsfel: ", error);
				alert("Kunde inte ansluta till chatten. Kontrollera servern.");
			} finally {
				setLoading(false);
			} // gjorde en try catch sats här för att få bättre respons vid fel
			
    };

    const sendMessage = async (message) => {
        if (connection) {
            await connection.invoke("SendMessage", chatRoom, role, userName, message);
        } // la till roll och chatrum här
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900">
            <main className="container flex-grow mx-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-white">Connecting to chat room...</p>
                    </div>
                ) : (
                    connection ? (
                        <>
                            <ChatRoom usermessages={usermessages} />
                            <ChatBox sendMessage={sendMessage} />
                        </>
                    ) : ( // la till roll och rum här som en dropdown meny
                        <div className="flex items-center justify-center min-h-screen bg-gray-900">
                            <div className="w-full max-w-lg p-8 mx-4 bg-white rounded-lg shadow-lg md:mx-auto">
								<select
									value={role}
									onChange={(e) => setRole(e.target.value)}
									className="w-full p-2 mb-2 border rounded"
								>
									<option value="" disabled>Choose your role</option>
									<option value="Student">Student</option>
									<option value="Teacher">Teacher</option>
								</select> 
								<input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
								<select
									value={chatRoom}
									onChange={(e) => setChatRoom(e.target.value)}
									className="w-full p-2 mb-2 border rounded"
								>
									<option value="" disabled>Choose channel</option>
									<option value="General">General</option>
									<option value="Announcements">Announcements</option>
								</select>
                                <button onClick={() => joinChatRoom(role, userName, chatRoom)}>Join Chat Room</button>
                            </div>
                        </div>
                    )
                )}
            </main>
        </div>
    );
};

export default ChatHome;