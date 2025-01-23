import React from 'react';
import SendTokenForm from './components/SendTokenForm';
import Placeholder from './components/Placeholder';
import './App.css';

const App = () => {
    return (
        <div className="App">
            {window.ethereum ? <SendTokenForm /> : <Placeholder />}
        </div>
    );
};

export default App;