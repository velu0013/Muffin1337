import ReactDataSheet from 'react-datasheet';
import React from 'react';
import 'react-datasheet/lib/react-datasheet.css'

class ReactjsTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      grid: props.tableData
    }
  }
  render () {
    return (
      <ReactDataSheet
        data={this.state.grid}
        valueRenderer={(cell) => cell.value}
        onCellsChanged={changes => {
          const grid = this.state.grid.map(row => [...row])
          changes.forEach(({cell, row, col, value}) => {
            grid[row][col] = {...grid[row][col], value}
          })
          this.setState({grid})
          this.props.setData(grid)
        }}
      />
    )
  }
}

export default ReactjsTable

