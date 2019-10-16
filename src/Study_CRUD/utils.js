import React from 'react';
import Popup from "reactjs-popup";


// Performs the function f(arg) and then the function close().
// To disable either function call, set to null.
function ConfirmButton({label, f=null, arg, close=null}){
	return(
		<input
		type="button"
		value={label}
		className="button_popup"
		onClick={event => 
			{	
				if(f !== null){f(arg)};
				if(close !== null){close()};
			}
		}
		/>
	)	
}

function InfoPop(props){
	return(
	<Popup trigger={<button className="info_pop">i</button>} 
		position={'left top'}
		closeOnDocumentClick
		mouseLeaveDelay={100}
		mouseEnterDelay={50}
		on='hover'
		>{props.info}
	</Popup>);
}




const utils = {
	ConfirmButton: ConfirmButton,
	InfoPop: InfoPop
}

export default utils