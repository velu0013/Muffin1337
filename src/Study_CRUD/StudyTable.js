import ReactDataSheet from 'react-datasheet';
import React, {setState} from 'react';
import 'react-datasheet/lib/react-datasheet.css'
import Popup from "reactjs-popup";

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

export default StudyTable

