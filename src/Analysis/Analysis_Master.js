import Testanalys1 from './Components/Testanalys_c.js'


const Analyzer = [ 
  {name: 'Testanalys1', 
  description: 'Här testar jag att filerna kommunicerar som tänkt', 
  component: Testanalys1}, 
  {name: 'analys2', 
  description: 'test igen', 
  component: analyze1}
 ]; 

function analyze1(props){
  return 1;
}

export default Analyzer;