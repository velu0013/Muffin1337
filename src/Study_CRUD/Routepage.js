import React, {useState, Component} from "react";
import {BrowserRouter as Router, Route, Link, useLocation,Redirect} from "react-router-dom";
import Popup from "reactjs-popup";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import StudyDBT from './Study.js';
import {Homepage} from './Home.js';
import {Openpage} from './Open.js';
import {Editpage} from './Edit.js';
import {Analysispage} from './Analysis.js';
import {Muffinpage} from './Muffingroup.js';

import {Helppage} from './Help.js';
import DB from './DB.js';
import utils from './utils.js'
import {NewButton} from './New.js';
import {UploadButton, DownloadButton} from './Filemgmt.js'
import Analyzers from '../Analysis/Analysis_Master.js'

import  drop from '../img/drops.svg';
import login_icon from '../img/login.svg'
import logout_icon	from '../img/logout.svg'
import 'react-tabs/style/react-tabs.css';

const Home = '/'
const Stud = '/MyStudies'
const Edit = '/Edit'
const Anys = '/Analysis'
const Help = '/Help'
const Muff = '/MuffinGroup'
const Login = '/Login'



function RoutePage() {
    const [study, setStudy] = useState(new StudyDBT())
    const web = useLocation().pathname
	const [login, setLogin]= useState(false)
		
	const [pagen, setPagen] = useState(false);
    const [Skey, setKey] = useState('');
	
	const currstudy = DB.getCurrentStudy();


	if(study === null || study.name === ''){
        if(currstudy === null){
			if(pagen){
				setPagen(false);
			}
        }else{
		setStudy(currstudy)}
	}
	if(Home!==web && Muff!==web && Help!==web && Login!==web){
			if(currstudy && !pagen){setPagen(true)}
	}else{
		if(pagen){setPagen(false)}
	}
    return(
        <div className="App">
			<div className="Header-bar">   
		  		<ul >	
			   		<Link to={Login} >	
						<img 
							src={login?logout_icon:login_icon}
							className="login-symbol" 
							onClick={event => 
							{	setLogin(!login)
							
							}
							}/>
					</Link> 
					
					<div className="Dropdown-menu">
						<img src={drop} className="Droper"/>	
						<div className="Drop-menu">
							<Link to={Home} className={Home===web?"Header-link-active":"Header-link"}>
								Home
							</Link>
							<Link to={Anys} className={Anys===web?"Header-link-active":"Header-link"}>
								My Page
							</Link>
							<Link to={Muff} className={Muff===web?"Header-link-active":"Header-link"}>
								About us
							</Link>
							<Link to={Help} className={Help===web?"Header-link-active":"Header-link"}>
								Help Me
							</Link>
						</div>
					</div>
                </ul>
			</div> 
			<div className="First-class">
				<div className="Header-bar2">
       				<PrintStudyList study={study} setStudy={setStudy} Skey={Skey} setKey={setKey} />
				</div>
			</div>		
			<div className={pagen?"Second-class":"Second-class1"}>
				<Tabs>
					<TabList className="Tabs-fix" >
						<Tab   className="Tabss">Edit</Tab>
						<br></br>
						<Tab   className="Tabss">Analysis</Tab>
					</TabList>
					<TabPanel >		
						{currstudy?<Redirect to='/Edit' />:<Redirect to='/' />}
					</TabPanel>
					<TabPanel >
						{currstudy?<Redirect to='/Analysis' />:<Redirect to='/' />}
					</TabPanel>
				</Tabs>

			</div> 
            <div className="App-body">
                <Route path="/MuffinGroup">
                    <Muffinpage />
                </Route>
				<Route path="/Login">
                    <Loginpage Login={login}/>
                </Route>
                <Route exact path="/">
                    <Homepage/>
                </Route>
                <Route path="/MyStudies">
                    <Openpage study={study} setStudy={setStudy}/>
                </Route>   
                <Route path="/Edit"> 
                    <Editpage study={study} setStudy={setStudy}/>
                </Route>
                <Route path="/Analysis">
                    <Analysispage study={study} setStudy={setStudy} />
                </Route>             
                <Route path="/Help" component={Helppage} />
	        </div>
        </div>
   
   );
}





function PrintStudyList({study, setStudy, Skey, setKey}){
    const StudyList = DB.GetStudies(Skey)
   	const [select, setSelect] = useState(false)
	if(StudyList === null){
		return (<>{'You have no studies yet'}
		<UploadButton study={study} setStudy={x => {setStudy(x); setSelect(true)}}/>
	</>	)
	}
	return (
		<>
       <p className="Stud">My Studies</p>
       	<input className="Text-input1" type="text" placeholder="Search..." value={Skey} onChange={event => setKey(event.target.value)}/>
		<div className="nyebuttons"> 
                <NewButton study={study} setStudy={setStudy}/>
		        <UploadButton study={study} setStudy={x => {setStudy(x); setSelect(true)}}/>
				{select && <Redirect to='/Edit' />}
       </div>
        <ul className="study-list">
		  {StudyList.map((value, index) => {
			return <ul key={index}>{
				<RedirectToEdit study={study} setStudy={setStudy} GetStudy={StudyList[index]} />
			}
		</ul>
		  })}{
		  //<ClearButton study={study} setStudy={setStudy} />
          }
		</ul>
		</>
	  )
}


function RedirectToEdit(props){
	const [select, setSelect] = useState(false)
	var Study = props.GetStudy;

    return (
		<> 
			<ConfirmText label={Study} f={name => 
				{
					props.setStudy(DB.OpenStudy(name))
					setSelect(true);

				}} arg={Study}
			/>
			{select && <Redirect to="/Edit"/>}
		</>
    );
}

function ConfirmText({label, f=null, arg, close=null}){
	return(
		<input
		type="button"
		value={label}
		className="Text-button2"
		onClick={event => 
			{	
				if(f !== null){f(arg)};
				if(close !== null){close()};
			}
		}
		/>
	)	
}

function ClearButton(props){
	return(
		
		<Popup trigger={<button className="button_pop menu">Delete All</button>} modal position="top right">
		{close => (
		<div className="Text-color-fix">
			{'Delete All Entries?'}
			<br></br>
				<utils.ConfirmButton label={'Yes'} f={_ => 
				{	
					DB.ClearAll()
					props.setStudy(new StudyDBT('', [0,0], [0,0]))
				}} arg={null} close={close}
			/>
			<utils.ConfirmButton label={'No'} close={close}/>
		</div>
		)}
		</Popup>	
	)
}


function Loginpage(props){
	return(<>
		{props.Login?"Du är utloggad":"Du är inloggad"}
		</>
	)
}
export {RoutePage};