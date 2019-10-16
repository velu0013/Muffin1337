import ReactDataSheet from 'react-datasheet';
import React, {setState} from 'react';
import 'react-datasheet/lib/react-datasheet.css'
import Popup from "reactjs-popup";
import { tsModuleBlock } from '@babel/types';

function StudyTable(props){
  return (
    <>
    <Popup trigger={<button className="button_pop" > Edit Size </button>}
      position={'bottom left'}
      closeOnDocumentClick
      mouseLeaveDelay={300}
      mouseEnterDelay={150}
      on='hover'
      contentStyle={{ padding: "0px", border: "none" }}
      arrow={false}
    >
    {close => (
        <>
        <AutoAdjust close={close} tableData={props.tableData} setData={props.setData}/>
        <AddRow close={close} tableData={props.tableData} setData={props.setData}/>
        <AddColumn close={close} tableData={props.tableData} setData={props.setData}/>
        </>
    )}
    
    </Popup>
    {props.tableData[0][0].value}
    <ReactDataSheet
      data={props.tableData}
      valueRenderer={(cell) => cell.value}
      onCellsChanged={changes => {
        const grid = props.tableData.map(row => [...row])
        changes.forEach(({cell, row, col, value}) => {
          grid[row][col] = {...grid[row][col], value}
        })
        props.setData(grid)
      }}
    />
    </>);
}

function AutoAdjust(props){
  return( 
    <div
      className="dropdown-item"
      onClick={_=> props.close()}
    >Auto adjust
    </div>
  )
}

function AddRow(props){
  return(
    <div
      className="dropdown-item"
      onClick={_ => props.close()}
    >Add row
    </div>
  )
}

function AddColumn(props){
  return(
    <div
      className="dropdown-item"
      onClick={_ => props.close()}
    >Add column
    </div>
  )
}

function Duplicate_finder (props) {
	const result = []
	const rowlist = []
	const collist = []
	const result2 = []
	var i;
	for (i=0; i < 4; i++) {
		collist.push(props.arra1[0][i].value)
	}

	for (i=0; i < collist.length; i++) {
		if (i != collist.lastIndexOf(collist[i]))
			result.push(collist[i])
	}

	for (i=0; i < props.arra1.length; i++) {
		rowlist.push(props.arra1[i][0].value)
	}
	
	for (i=0; i < rowlist.length; i++) {
		if (i != rowlist.lastIndexOf(rowlist[i]))
			result2.push( rowlist[i])
	}
	result.push(result2)
	
	return result
}

export default StudyTable

