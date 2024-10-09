// Dependencies
import React, { useState } from 'react';
// Constants
import { lowercase, uppercase, numbers, symbols } from '../constants/PasswordConstants';

const Home = () => {
    const [length, setLength] = useState(10);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeUppercase, setIncludeUppercase] = useState(false);
    const [includeNumbers, setIncludeNumbers] = useState(false);
    const [includeSymbols, setIncludeSymbols] = useState(false);
    const [password, setPassword] = useState('');
    const generatePassword = () => {
        let characters = '';
        if (includeLowercase) characters += lowercase;
        if (includeUppercase) characters += uppercase;
        if (includeNumbers) characters += numbers;
        if (includeSymbols) characters += symbols;
        let generatedPassword = '';
        for (let i = 0; i < length; i++) {
            generatedPassword += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setPassword(generatedPassword);
    };
    const copyToClipboard = () => {
        navigator.clipboard.writeText(password);
        alert('Password copied to clipboard!');
    };
    return (
        <>
            <div className="flex flex-col items-center justify-center bg-gray-600 min-h-screen">
                <h1 className="text-4xl font-bold mb-4 text-white">Password Generator</h1>
                <p className="mb-8 text-lg text-gray-300">Generate a secure password with one click!</p>
                <div className="flex flex-col items-center mb-4">
                    <label className="text-white mb-2">Character Length: {length}</label>
                    <input
                        type="range"
                        min="4"
                        max="20"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className="slider mb-4"
                    />
                    <div className="flex flex-col items-start mb-4">
                        <label className="text-white">
                            <input
                                type="checkbox"
                                checked={includeLowercase}
                                onChange={(e) => setIncludeLowercase(e.target.checked)}
                                className="mr-2"
                            />
                            Include Lowercase
                        </label>
                        <label className="text-white">
                            <input
                                type="checkbox"
                                checked={includeUppercase}
                                onChange={(e) => setIncludeUppercase(e.target.checked)}
                                className="mr-2"
                            />
                            Include Uppercase
                        </label>
                        <label className="text-white">
                            <input
                                type="checkbox"
                                checked={includeNumbers}
                                onChange={(e) => setIncludeNumbers(e.target.checked)}
                                className="mr-2"
                            />
                            Include Numbers
                        </label>
                        <label className="text-white">
                            <input
                                type="checkbox"
                                checked={includeSymbols}
                                onChange={(e) => setIncludeSymbols(e.target.checked)}
                                className="mr-2"
                            />
                            Include Symbols
                        </label>
                    </div>
                    <button className="btn btn-primary mb-4" onClick={generatePassword}>
                        Generate Password
                    </button>
                    <div className="flex items-center">
                        <input
                            type="text"
                            className="input input-bordered w-full max-w-xs"
                            readOnly
                            placeholder="Your secure password will appear here"
                            value={password}
                        />
                        <button className="btn btn-secondary ml-2" onClick={copyToClipboard}>
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;