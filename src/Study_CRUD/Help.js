import React, {useState} from 'react';
import Popup from "reactjs-popup";


function Helppage(){
    const [helpString, setHelp] = useState('Choose subject')
    return(
        <>
        <div>
        <HelpButton setHelp={setHelp}/>
        </div>
        <div>
        {helpString}
        </div>
        </>
    );
}

function HelpButton(props){
	return(
        <Popup trigger={<button className="button_pop">Help</button>} 
            position={'right top'}
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            on='hover'
            contentStyle={{ padding: "0px", border: "none" }}
            arrow={false}
        >
		{close => (
            <>
            <MenuItem label="Creating a study" content={
                <>
                <Item label="How to create" subject={helps.create}  setHelp={sub => {props.setHelp(sub); close();}}/> 
                <Item label="Choosing dimensions" subject={helps.choosedims}  setHelp={sub => {props.setHelp(sub); close();}}/> 
                </>
            }/>
            <MenuItem label="Opening a study" content={
                <>
                <Item label="How to open" subject={helps.open}  setHelp={sub => {props.setHelp(sub); close();}}/> 
                <Item label="Searching" subject={helps.search}  setHelp={sub => {props.setHelp(sub); close();}}/> 
                </>
            }/> 
            <MenuItem label="Editing a study" content={
                <>
                <Item label="Editing size" subject={helps.edit}  setHelp={sub => {props.setHelp(sub); close();}}/> 
                <Item label="Content" subject={helps.edit}  setHelp={sub => {props.setHelp(sub); close();}}/> 
                <Item label="Storing" subject={helps.edit}  setHelp={sub => {props.setHelp(sub); close();}}/> 
                </>
            }/> 
            </>
        )}
        </Popup>
	)
}

function MenuItem(props){
    return(
        <Popup trigger={<div className="dropdown-item">{props.label}</div>} 
            position={'right top'}
            closeOnDocumentClick
            mouseLeaveDelay={0}
            mouseEnterDelay={0}
            on='hover'
            contentStyle={{ padding: "0px", border: "none" }}
            arrow={false}
        >
		{close => props.content}
        </Popup>
    )
}

function Item(props){
    return(
    <div 
        className="dropdown-item"
        onClick={_ => {
            props.setHelp(props.subject)
        }}
        >{props.label}
    </div>
    );
}


const helps = {
    create: 'Go to "My Studies" in the menu and click on "Create" at the top. Choose a name for your new study, a warning will appear if you try to save with a name that is already taken. Then click confirm, and you will be redirected to edit your tables.',
    choosedims: 'If you know the size of your tables (rows x columns), use these when creating the study. If you are unsure, you can use the default size, paste in your data and use the Auto-adjust function',
    open: 'Go to "My Studies" and click on the study you wish to open. Upon click, you will be redirected to edit the study.',
    search: 'You can use the search field to filter your list of studies by name. It does not search through table data.',
    edit: 'Helping with edit',

}


export {Helppage}