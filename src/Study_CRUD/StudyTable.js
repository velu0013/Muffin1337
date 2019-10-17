import ReactDataSheet from 'react-datasheet';
import React from 'react';
import 'react-datasheet/lib/react-datasheet.css'
import Popup from "reactjs-popup";
import {CreateGrid} from './Study.js'
import utils from './utils.js'

function StudyTable(props){
  if(props.tableData === null || props.tableData.length === 0){
    return(
    <>
      <EditButton tableData={props.tableData} setData={props.setData}/>
      <span >[ No table data ]</span>
    </>);
  }
  return (
  <>
    <EditButton tableData={props.tableData} setData={props.setData}/>

    <DuplicateFinder arra1 = {props.tableData} />

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



// Size modifiers
function EditButton(props){
  return(
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
  )
}

function AutoAdjust(props){
  return( 
    <div
      className="dropdown-item"
      onClick={_=> {
        if(props.tableData !== null && props.tableData.length > 0){
          let [rows, cols] = [props.tableData.length, props.tableData[0].length];
          let [rs, cs, i] = [0,0,0];
          while(++i < rows*cols && props.tableData[rs][cs].value === ''){
            rs = Math.floor(i/cols)
            cs = i%cols
          }
          if(i < rows*cols){
            let columns = -1;
            while(++columns < cols-cs && props.tableData[rs][columns+cs].value !== '');
            let newRow = [];
            let newGrid = [];
            for(let r=rs; r<rows; r++){
              for(let ci=cs; ci<columns+cs; ci++){
                if(props.tableData[r][ci].value !== ''){
                  for(let c=cs; c<columns+cs; c++){
                    newRow.push(props.tableData[r][c]);
                  }
                  newGrid.push(newRow);
                  newRow = [];
                  break;
                }
              }
            }
            props.setData(newGrid);
          }
        }
        props.close();
      }}
    ><utils.InfoPop info={'Locates the top left cell and uses the width of the header row, then keeps any none empty rows below'}/> Auto adjust
    </div>
  )
}

function AddRow(props){
  return(
    <div
      className="dropdown-item"
      onClick={_ => {
        if(props.tableData === null || props.tableData.length === 0){
          props.setData(CreateGrid(1, 1))
        }else{
          const newRow = CreateGrid(1, props.tableData[0].length)[0]
          const row_update = props.tableData
          row_update.push(newRow)
          props.setData(row_update)
        }
        props.close()
      }}
    >Add row
    </div>
  )
}

function AddColumn(props){
  return(
    <div
      className="dropdown-item"
      onClick={_ => {
        if(props.tableData === null || props.tableData.length === 0){
          props.setData(CreateGrid(1, 1))
        }else{
          const column_update = props.tableData
          for(let i=0; i<props.tableData.length; i++){
            column_update[i].push({value: ''})  
          }  
          props.setData(column_update)
        }
        props.close()
      }}
    >Add column
    </div>
  )
}


// Duplicate finder
function DuplicateFinder (props) {
	const rowdup = []
	const rowlist = []
	const collist = []
	const coldup = []
  var i;

	for (i=0; i < props.arra1[0].length; i++) {
		collist.push(props.arra1[0][i].value)
	}

	for (i=0; i < collist.length; i++) {
		if (collist[i] !== '' && i !== collist.lastIndexOf(collist[i]))
			rowdup.push(collist[i])
	}

	for (i=0; i < props.arra1.length; i++) {
		rowlist.push(props.arra1[i][0].value)
	}
	
	for (i=0; i < rowlist.length; i++) {
		if (rowlist[i] !== '' && i !== rowlist.lastIndexOf(rowlist[i]))
			coldup.push( rowlist[i])
	}

  const dupsexists = rowdup.length > 0 || coldup.length > 0
  return (
    dupsexists ? 
      <p className = "text_color">
      Title duplicates!
      <br></br>
      Row: {rowdup}
      <br></br>
      Column: {coldup}
      </p> :
    ""
  )
}


// Commands

export default StudyTable

