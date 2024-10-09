// Dependencies
import React from 'react'

const Footer = () => {
    const companyName = 'daydin14';
    const year = new Date().getFullYear();
    const rights = 'All rights reserved.';
    const author = 'David Aydin';

    return (
        <>
            <footer className="bg-gray-800 text-white p-4">
                <p className="text-center">{companyName} &copy; {year} {rights}</p>
                <p className="text-center">Created by {author}</p>
            </footer>
        </>
    )
}

export default Footer
