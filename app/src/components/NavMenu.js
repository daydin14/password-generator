// Dependencies
import React from 'react'
import { Link } from 'react-router-dom';

const NavMenu = () => {
    return (
        <>
            <nav className="bg-base-100 shadow-lg">
                <ul className="menu menu-horizontal p-4">
                    <li className="menu-item">
                        <Link to="/" className="btn btn-ghost normal-case text-xl">Home</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default NavMenu
