import ClusterAnalysis from './Components/Cluster.js'
import ParameterRelevance from './Components/ParameterRelevance.js'

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
];


export default Analyzers;