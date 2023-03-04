import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

type APIData = {
  plateNumber: string;
  carImageLocation: string;
  entryTimeStamp: string;
};

// get time in the following format: hh:mm date, month, year. and use 24 hours format and month in words
function getTime() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day} ${month}, ${year}`;
}

const Chat = () => {
  const [data, setData] = useState<APIData[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    const socket = io('http://localhost:3000');

    // Handle incoming data
    socket.on('redis-update', (data: any) => {
      setData((prevData) => [...prevData, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue !== '') {
      const socket = io('http://localhost:3000');

      // Send the data to the server
      const newData = {
        plateNumber: 'ABC-123-WW-45',
        // carImageLocation: '/images/cars/ABC123.png',
        carImageLocation: inputValue,
        entryTimeStamp: getTime(),
      };
      socket.emit('chat message', newData);

      // Add the data to the local state
      setData((prevData) => [...prevData, newData]);

      // Reset the input value
      setInputValue('');
    }
  };

  return (
    <div>
      <ul>
        {data.map((msg) => (
          <li key={msg.carImageLocation}>
            {msg.plateNumber}, {msg.carImageLocation}, {msg.entryTimeStamp}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
