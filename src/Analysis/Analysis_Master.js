import Testanalys1 from './Components/Testanalys_c.js'
import Testanalys2 from './Components/Testanalys2_c.js'


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
  }
];


export default Analyzers;