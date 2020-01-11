import ClusterAnalysis from './Components/Cluster.js'
import ParameterRelevance from './Components/ParameterRelevance.js'
import LinearDep from './Components/LinearDep.js'
import {
  PCAcomp
} from './Components/PCA-component'
import ConsumerGroups from './Components/consumerGrouping.js'
import TrialSpace from './Components/TrialSpace.js'

const Analyzers = [{
    name: 'View Trial Space',
    component: TrialSpace,
    description: 'Visual overview of the recipe sample space'
  },
  {
    name: 'Consumer clustering',
    component: ConsumerGroups,
    description: 'Groups consumers by k-mode clustering'
  },
  {
    name: 'Linear Relation',
    component: LinearDep,
    description: 'Assumes a linear relationship between recipe parameter and preference response and plots each participant as a point according to their preference. Colors points depending on which parameter is selected.'
  },
  {
    name: 'PCA',
    component: PCAcomp,
    description: 'The method reduces the dimensionality of a dataset using principal component analysis.'
  },
  {
    name: 'Cluster Analysis',
    component: ClusterAnalysis,
    description: 'Plots clusters'
  },
  {
    name: 'Parameter Relevance',
    component: ParameterRelevance,
    description: 'Uses machine learning to try and predict a parameter based on patterns in the data. The relevance of a parameter is then based on the success rate of the predictions.'
  }
];


export default Analyzers;