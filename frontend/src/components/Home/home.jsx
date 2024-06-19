import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

function Home() {
    const navigate = useNavigate();
    
    useEffect(() => {
        if (localStorage.getItem("user")) {
            navigate("/Profile");
        }
    }, [navigate]);

    const gologin = () => {
        navigate('/login');
    };

    return (
        <main className='homebody'>
            <section className='welcome-section'>
                <h3 className='welcome'>Welcome to</h3>
                <h1 className='h11'><b>Campus Profile</b></h1>
                <p className='intro-text'>Connect with your peers, explore opportunities, and grow together.</p>
            </section>
            <button className='btn' onClick={gologin}>
                Let's Get Started <i className='fas fa-arrow-right'></i>
            </button>
        </main>
    );
}

export default Home;
