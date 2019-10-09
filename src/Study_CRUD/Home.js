/* Version 1.0
 * 
 *
 *
 */

import React, { useState } from 'react';
import logo from '../img/vonkansmuffin.svg';


// testkommentar 

function Homepage(props) {
	const [name, setName] = useState('Vonkan');
	const [butters, setButton] = useState('Launch');
	const [counterReact, setC] = useState(0)
	return (<>
		<div className="Page-header">
		Spin-muffins data analysis
		</div>

		<p>
		We are a group of students from Umeå University taking the course Design Build Test.
		The aim of this course is to perform a project together with a company in order to gain 
		experience in designing and developing new products as a team.
		</p>
		<p>
		Our project is to develop an app for clients with large sets of data.
		The goal with this app is to let clients upload, store and analyze data in forms of tables.
		The data consists of <br></br>
		 - recipes<br></br>
		 - consumer descriptions <br></br>
		 - consumer preferences.<br></br>
		</p>
		<p>
		In order for clients to analyze their data we will add features such as	constructing graphs 
		and tables from different sets of data of their preference.
		</p>
		</>
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