import ClusterAnalysis from './Components/Cluster.js'
import ParameterRelevance from './Components/ParameterRelevance.js'
import LinearDep from './Components/LinearDep.js'

const Analyzers = [
  {name: 'Cluster Analysis', 
  component: ClusterAnalysis,
  description: 'Plots clusters'
  }
  ,
  {name: 'Parameter Relevance', 
  component: ParameterRelevance,
  description: 'Uses machine learning to try and predict a parameter based on patterns in the data. The relevance of a parameter is then based on the success rate of the predictions.'
  }
  ,
  {name: 'Linear Relation', 
  component: LinearDep,
  description: 'Assumes a linear relationship between recipe parameter and preference response and plots each participant as a point according to their preference. Colors points depending on which parameter is selected.'
  }
];


export default Analyzers;