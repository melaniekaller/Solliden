import React from 'react';
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className=' bg-emerald-800 bg-opacity-90 font-Lora flex justify-center items-center h-24'>
            <div className='w-2/5 flex justify-between text-white items-center'>
                <p className=' font-semibold text-5xl'>SOLLIDEN</p>
                <ul className='flex text-xl w-fit gap-2 justify-around'>
                    <Link to="LoginPage" className="">
                        Logga in</Link>
                    <p>/</p>
                    <Link to="RegisterPage" className="">
                        Registrera</Link>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;