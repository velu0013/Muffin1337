import Testanalys1 from './Components/Testanalys_c.js'
import Testanalys2 from './Components/Testanalys2_c.js'
import ClusterAnalysis from './Components/Cluster.js'
import ParameterRelevance from './Components/ParameterRelevance.js'

const Analyzers = [
  {name: 'Test1', 
  component: Testanalys1,
  description: 'Här testar jag att filerna kommunicerar som tänkt'
  },
  {name: 'Test2', 
  component: Testanalys2,
  description: 'Här är ett till men nästan likadant test'
  },
  {name: 'Test3', 
  component: Testanalys2,
  description: 'Och här är bara samma test igen'
  },
  {name: 'Muffin', 
  component: Testanalys2,
  description: 'Muffin äger'
  },
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