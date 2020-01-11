import React from 'react';
import UML from '../img/UML.svg'
import Venn from '../img/Venn.png'


function Homepage(props) {
	return (<>
		<div className="Page-header">
			What it does
		</div>
		<p>
			<img src={Venn} alt="Venn Diagram" ></img></p>
		<div className="Page-header">
			How it's done
		</div>
		<br></br>
		<p>
			<img src={UML} alt="UML Diagram" ></img>
		</p>
	</>
	);
}



export { Homepage };