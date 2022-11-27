import React from 'react'
import SendTokenForm from './components/sendTokenForm'
import Placeholder from './components/placeholder'
import './App.css'

function App() {
	return (
		<div className="App">
			{window.ethereum ?
				<SendTokenForm /> :
				<Placeholder />
			}
		</div>
	)
}

export default App
