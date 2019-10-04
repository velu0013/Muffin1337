/* Version 1.0
 * 
 *
 *
 */

import React, { useState } from 'react';
import logo from './vonkansmuffin.svg';

var counter = 0



function Homepage(props) {
	const [name, setName] = useState('Vonkan');
	const [butters, setButton] = useState('Launch');
	const [counterReact, setC] = useState(0)
	return (
		<div className="App">
		  <header className="App-header">
			<br></br>
			<Snurrmuffin counterReact={counterReact} name={name} />
			<p>
			<InterF counterReact={counterReact} butters={butters} setC={setC} name={name} setName={setName}/>
			</p>
		  </header>
		</div>
	);
}


function InterF(props){
	return <>
			<input
				type="text"
				value={props.name}
				onChange={event => props.setName(event.target.value)}
			/>
			<input
				type="button"
				value={props.butters}
				onClick={event => props.setC(props.counterReact+1)}
			/>
			</>
}

function Snurrmuffin(props){
	return <>
			<img src={logo} className="App-logo" alt="logo" />
			<p>
			{props.name}s snurrmuffin launched at {currTime(":")}, count is at {props.counterReact}.
			</p>
			<a
			  className="App-link"
			  href="https://reactjs.org"
			  target="_blank"
			  rel="noopener noreferrer"
			>
			  Learn React
			</a>
			</>
}


function currTime(sep){
	var d = new Date()
	var logon = [d.getHours(),"", d.getMinutes()]
	logon[2]<10 ? logon[1] = [sep, "0"] : logon[1] = sep
	return logon;
}

export {Homepage};