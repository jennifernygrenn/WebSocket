import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const ChatRoom = ({ usermessages }) => {
    const messagesEndRef = useRef(null);
	const limitedMessages = usermessages.slice(-25); // ändrade till 25 meddelanden som visas

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [limitedMessages]); // bytte till den begärnsade här

    return (
        <div className="h-screen p-4 overflow-y-scroll bg-white rounded-lg shadow-lg">
            {limitedMessages.map((msg, index) => (
                <div key={index} className={`mb-2 p-2 rounded ${msg.isSystem ? 'bg-gray-200' : 'bg-blue-200'}`}>
                    <strong>{msg.role} - {msg.user}: </strong>{msg.message} 
                </div> // la till rollen här
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

ChatRoom.propTypes = {
    limitedMessages: PropTypes.arrayOf(
        PropTypes.shape({
			role: PropTypes.string.isRequired,
            user: PropTypes.string.isRequired,
            message: PropTypes.string.isRequired
        }) // och här
    ).isRequired
};

export default ChatRoom;