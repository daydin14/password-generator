// Dependencies
import React from 'react'

// Components
import NavMenu from './NavMenu'

const Header = () => {
    return (
        <>
            <header className="bg-base-200 p-4 shadow-md">
                <h1 className="text-3xl font-bold text-primary mb-4">Dave&apos;s PG</h1>
                <NavMenu />
            </header>
        </>
    )
}

export default Header
