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

const socket = io('http://localhost:3000');

const Chat = () => {
  const [data, setData] = useState<APIData[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch('http://localhost:3000/api/events');
        const data = await result.json();
        console.log('fetch result: ', data);
        // convert an object into array of objects
        const newData = Object.keys(data.events).map((key) => ({
          plateNumber: key,
          carImageLocation: data.events[key].carImageLocation,
          entryTimeStamp: data.events[key].entryTimeStamp,
        }));

        setData(newData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Handle incoming data
    const eventListener = (data: any) => {
      console.log('redis update event emittion detected');
      console.log('new incoming data: ', data);
      setData((prevData) => [data, ...prevData]);
    };
    socket.on('redis-update', eventListener);

    return () => {
      // socket.disconnect();
      socket.off('redis-update', eventListener);
    };
  }, [socket]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue !== '') {
      const socket = io('http://localhost:3000');

      // Send the data to the server
      const newData = {
        plateNumber: 'ABC-123-WW-41',
        // carImageLocation: '/images/cars/ABC123.png',
        carImageLocation: inputValue,
        entryTimeStamp: getTime(),
      };
      socket.emit('redis-update', newData);

      // Reset the input value
      setInputValue('');
    }
  };

  return (
    <div>
      <ul>
        {data.map((msg, idx) => (
          <li key={idx}>
            i{/* <li key={msg.carImageLocation}> */}
            {msg.plateNumber}, {msg.carImageLocation}, {msg.entryTimeStamp}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="text-black"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
