import {method1} from '../Methods/Testanalys_m.js'

function Testanalys1({study, params}){
  return (
  <>
  Här analyseras {params[0]} i studyn {study.name} genom testfien som returnerar att 2*2={method1(2)}
  </>
 ); 
}

export default Testanalys1;