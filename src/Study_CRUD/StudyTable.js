import ReactDataSheet from 'react-datasheet';
import React, { useState } from 'react';
import 'react-datasheet/lib/react-datasheet.css'
import Popup from "reactjs-popup";
import { CreateGrid } from './Study.js'
import utils from './utils.js'
import DB from './DB.js'
import Warning from '../img/Warning.png'
import UndoIcon from '@material-ui/icons/Undo';
import EditIcon from '@material-ui/icons/Edit';

const contentStyle = {
    marginLeft: "42.5%",
	background: "#F0F0F0",
	width: "20%",
	border: "none"
};


function StudyTable(props) {
  if (props.tableData === null || props.tableData.length === 0 || props.tableData[0].length === 0) {
    return (
      <>
        <AltEditButton tableData={props.tableData} setData={props.setData} />
        <span >[ No table data ]</span>
      </>);
  }
  return (
    <>
      

      <ReactDataSheet
        data={props.tableData}
        valueRenderer={(cell) => cell.value}
        onCellsChanged={changes => {
          const grid = props.tableData.map(row => [...row])
          changes.forEach(({ cell, row, col, value }) => {
            grid[row][col] = { ...grid[row][col], value }
          })
          DB.setCurrentTable(grid, props.tableKey)
          props.setData(grid)
        }}
      />

<div className="table-header">
        <BackButton tableKey={props.tableKey} setData={grid => {
          DB.setCurrentTable(grid, props.tableKey)
          props.setData(grid)
        }}
        />
        <EditButton tableData={props.tableData} setData={grid => {
          DB.setCurrentTable(grid, props.tableKey)
          props.setData(grid)
        }}
          tableQQ={props.tableQQ}
          setQQ={props.setQQ}
        />
      </div>

      <DuplicateFinder arra1={props.tableData} />
    </>);
}

function BackButton(props) {
  return (
    <UndoIcon
    className="Mui tab"
    //<input type="button" className="button_pop" value="Undo"
      onClick={_ => {
        const oldTable = DB.getCurrentTable(1, props.tableKey)
        if (oldTable !== null) {
          props.setData(oldTable)
        }
      }}
    />
  );
}

// Size modifiers
function EditButton(props) {
  return (
    <Popup trigger={
      <EditIcon className="Mui tab"/>//<button className="button_pop" > Edit </button>
    }
      position={'top left'}
      closeOnDocumentClick
      mouseLeaveDelay={300}
      mouseEnterDelay={200}
      on='hover'
      contentStyle={{ padding: "0px", border: "none" }}
      arrow={false}
    >
      {close => (
        <>
          <AutoAdjust close={close} tableData={props.tableData} setData={props.setData} />
          <AddRow close={close} tableData={props.tableData} setData={props.setData} />
          <AddColumn close={close} tableData={props.tableData} setData={props.setData} />
          <SetTypes close={close} tableData={props.tableData} tableQQ={props.tableQQ} setQQ={props.setQQ} />
          <SetSize close={close} tableData={props.tableData} setData={props.setData} />
        </>
      )}
    </Popup>
  )
}

//This is an alternate edit button for empty tables
function AltEditButton(props) {
  return (
    <Popup trigger={
      <EditIcon className="Mui tab"/>//<button className="button_pop" > Edit </button>
    }
      position={'bottom left'}
      closeOnDocumentClick
      mouseLeaveDelay={300}
      mouseEnterDelay={200}
      on='hover'
      contentStyle={{ padding: "0px", border: "none" }}
      arrow={false}
    >
      {close => (
        <>
          <SetSize close={close} tableData={props.tableData} setData={props.setData} />
        </>
      )}
    </Popup>
  )
}

function AutoAdjust(props) {
  return (
    <div
      className="dropdown-item"
      onClick={_ => {
        if (props.tableData !== null && props.tableData.length > 0) {
          let [rows, cols] = [props.tableData.length, props.tableData[0].length];
          let [rs, cs, i] = [0, 0, 0];
          while (++i < rows * cols && props.tableData[rs][cs].value === '') {
            rs = Math.floor(i / cols)
            cs = i % cols
          }
          if (i < rows * cols) {
            let columns = -1;
            while (++columns < cols - cs && props.tableData[rs][columns + cs].value !== '');
            let newRow = [];
            let newGrid = [];
            for (let r = rs; r < rows; r++) {
              for (let ci = cs; ci < columns + cs; ci++) {
                if (props.tableData[r][ci].value !== '') {
                  for (let c = cs; c < columns + cs; c++) {
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
    ><utils.InfoPop info={'Locates the top left non-empty cell and keeps only the columns width a header on that row, then removes any empty rows below. Does nothing if the table is empty.'} /> Auto adjust
    </div>
  )
}

function AddRow(props) {
  return (
    <div
      className="dropdown-item"
      onClick={_ => {
        if (props.tableData === null || props.tableData.length === 0) {
          props.setData(CreateGrid(1, 1))
        } else {
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

function AddColumn(props) {
  return (
    <div
      className="dropdown-item"
      onClick={_ => {
        if (props.tableData === null || props.tableData.length === 0) {
          props.setData(CreateGrid(1, 1))
        } else {
          const column_update = props.tableData
          for (let i = 0; i < props.tableData.length; i++) {
            column_update[i].push({ value: '' })
          }
          props.setData(column_update)
        }
        props.close()
      }}
    >Add column
    </div>
  )
}
function DimInput({ dim, setDims }) {
  return (
    <input
      className="Dimmer"
      type="number"
      value={dim}
      onChange={event => {
        if (parseInt(event.target.value, 10) >= 0) {
          setDims(parseInt(event.target.value, 10))
        }
      }}
    />
  )
}

function SetTypes(props) {
  const [newQQ, setNewQQ] = useState([...props.tableQQ]);
  const dispTable = [...newQQ];
  dispTable.push([...props.tableData[0]]);
  return (
    <Popup trigger={<div className="dropdown-item" > Set Data Types </div>}
      closeOnDocumentClick
      contentStyle={{ padding: "0px", border: "none" }}
      modal
    >
      {close => (
        <>
          <div>
            <span className="Text-color-fix">Set Data Types</span>
          </div>
          <br></br>
          <div className="Table-fix2">
            <ReactDataSheet
              data={dispTable}
              valueRenderer={(cell) => cell.value}
              onCellsChanged={changes => {
                const grid = newQQ.map(row => [...row])
                changes.forEach(({ cell, row, col, value }) => {
                  if (row < 1) {
                    grid[row][col] = { ...grid[row][col], value }
                  }
                })
                setNewQQ(grid);
              }}
            />
          </div>
          <br></br>
          <div>
            <utils.ConfirmButton label="Save" f={props.setQQ} arg={newQQ} close={props.close} />
            <utils.ConfirmButton label="Close" f={close} />
          </div>
        </>
      )
      }

    </Popup >
  )
}

function SetSize(props) {
  let [rows, cols] = [0, 0]
  if (props.tableData !== null && props.tableData.length > 0) {
    [rows, cols] = [props.tableData.length, props.tableData[0].length];
  }
  const [dims, setDims] = useState([rows, cols])
  return (
    <Popup trigger={<div className="dropdown-item" > Set Size </div>}
      position={'bottom left'}
      closeOnDocumentClick
      contentStyle={contentStyle}
      modal
    >
      {close => (
        <>
          <div>
            <span className="Text-color-fix">Set dimensions</span>
          </div>
          <div>
            <DimInput dim={dims[0]} setDims={x => setDims([x, dims[1]])} />
            <DimInput dim={dims[1]} setDims={x => setDims([dims[0], x])} />
          </div>
          <div>
            <utils.ConfirmButton label="Resize"
              f={([nr, nc]) => {
                if (props.tableData === null || props.tableData.length === 0) {
                  props.setData(CreateGrid(nr, nc));
                } else {
                  let newRow = [];
                  let newGrid = [];
                  for (let r = 0; r < Math.min(rows, nr); r++) {
                    for (let c = 0; c < nc; c++) {
                      if (c >= cols) {
                        newRow.push({ value: '' });
                      } else {
                        newRow.push(props.tableData[r][c]);
                      }
                    }
                    newGrid.push(newRow);
                    newRow = [];
                  }
                  for (let r = rows; r < nr; r++) {
                    newGrid.push(CreateGrid(1, nc)[0]);
                  }
                  props.setData(newGrid);
                }
              }}
              arg={dims}
              close={props.close}
            />
            <utils.ConfirmButton label="Close" f={close} />
          </div>
        </>
      )}

    </Popup>
  )
}



// Duplicate finder
function DuplicateFinder(props) {
  const rowdup = []
  const rowlist = []
  const collist = []
  const coldup = []
  var i;

  for (i = 0; i < props.arra1[0].length; i++) {
    collist.push(props.arra1[0][i].value)
  }

  for (i = 0; i < collist.length; i++) {
    if (collist[i] !== '' && i !== collist.lastIndexOf(collist[i]))
      rowdup.push(collist[i])
  }

  for (i = 0; i < props.arra1.length; i++) {
    rowlist.push(props.arra1[i][0].value)
  }

  for (i = 0; i < rowlist.length; i++) {
    if (rowlist[i] !== '' && i !== rowlist.lastIndexOf(rowlist[i]))
      coldup.push(rowlist[i])
  }

  const dupsexists = rowdup.length > 0 || coldup.length > 0
  return (
    dupsexists ?
      <div className="Warning-div">
        <img src={Warning} alt={"Warning"} className="Warning-logo" />
        <p className="Warning-text">
          Title duplicates!
      <br></br>
          Row: {rowdup}
          <br></br>
          Column: {coldup}
        </p>
      </div> :
      ""
  )
}


// Commands

export default StudyTable

