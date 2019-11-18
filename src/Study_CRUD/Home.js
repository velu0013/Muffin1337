import React from 'react';


function Homepage(props) {
	return (<>
		<div className="Page-header">
		About the app
		</div>
		<p>
		This app let's you paste your tables of data from Excel or similar apps and use some of our implemented analysis techniques to see what less evident information your data actually contains.
		</p>
		<p>
		Under 'My Studies' you can create new studies or open any existing ones, then under 'Edit' you can insert your data and finally select 'Analyze' and choose a suitable analysis type.
		</p>
		<p>
		The app supports adding new rows to your existing data for instant analysis feedback. Just edit, save and return to analysis to see the effects of your changes!
		</p>
		</>
	);
}



export {Homepage};