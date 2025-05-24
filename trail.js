// src/cryptoUtils.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key'; // Use your actual secret key
const BASE_URL = 'http://localhost:5000'; // Base URL for your API

export const fetchAndDecryptData = async (endpoint) => {
    const url = `${BASE_URL}/${endpoint}`; // Construct the full URL

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const encryptedData = result.encryptedData; // Assuming the encrypted data comes under this key

        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const jsonData = bytes.toString(CryptoJS.enc.Utf8);
        
        if (!jsonData) {
            throw new Error('Decryption failed: Invalid ciphertext');
        }

        return JSON.parse(jsonData);
    } catch (error) {
        throw new Error(`Error fetching or decrypting data: ${error.message}`);
    }
};


// src/MyComponent.js
import React, { useEffect, useState } from 'react';
import { fetchAndDecryptData } from './cryptoUtils';

const MyComponent = ({ endpoint }) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const decryptedData = await fetchAndDecryptData(endpoint);
                setData(decryptedData);
            } catch (err) {
                setError(err.message);
            }
        };

        getData();
    }, [endpoint]); // Depend on the endpoint prop

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Fetched Data</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default MyComponent;

