import React from 'react';


function Muffinpage(props) {
	return (<>
		<div className="Page-header">
		About us
		</div>

		<p>
		We are a group of students from Umeå University in the later years of our studies, taking the course Design Build Test.
		The aim of this course is to perform a project together with a company in order to gain 
		experience in designing and developing new products as a team.
		</p>
		<p>
		Our project is to develop an app for clients with large sets of data.
		The goal with this app is to let clients upload, store and analyze data in the form of tables.
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


export {Muffinpage};