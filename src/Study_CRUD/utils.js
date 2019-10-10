import React from 'react';


// Performs the function f(arg) and then the function close().
// To disable either function call, set to null.
function ConfirmButton({label, f=null, arg, close=null}){
	return(
		<input
		type="button"
		value={label}
		className="button_pop"
		onClick={event => 
			{	
				if(f !== null){f(arg)};
				if(close !== null){close()};
			}
		}
		/>
	)	
}


const utils = {
    ConfirmButton: ConfirmButton
}

export default utils