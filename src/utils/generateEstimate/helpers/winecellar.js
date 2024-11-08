exports.getWineCellarHandleFabrication = (item, count) => {
    let oneInchHoles = 0;
    let hingeCut = 0;
    let selectedItemHoles = item?.fabrication?.oneInchHoles > 0 ? item?.fabrication?.oneInchHoles : 2;
  
    oneInchHoles = count * selectedItemHoles;
    let selectedItemhingeCut = item?.fabrication?.hingeCut > 0 ? item?.fabrication?.hingeCut : 0;
  
    hingeCut = count * selectedItemhingeCut;
    return { oneInchHoles, hingeCut };
  };
  
exports.getWineCellarHingeFabrication = (item, count) => {
    let oneInchHoles = 0;
    let hingeCut = 0;
    let selectedItemHoles = item?.fabrication?.oneInchHoles > 0 ? item?.fabrication?.oneInchHoles : 0;
  
    oneInchHoles = count * selectedItemHoles;
    let selectedItemHingeCut = item?.fabrication?.hingeCut > 0 ? item?.fabrication?.hingeCut : 1;
  
    hingeCut = count * selectedItemHingeCut;
  
    return { oneInchHoles, hingeCut};
  };
  
exports.getWineCellarGenericFabrication = (item, count) => {
    let oneInchHoles = 0;
    let hingeCut = 0;
  
    let selectedItemHoles = item?.fabrication?.oneInchHoles > 0 ? item?.fabrication?.oneInchHoles : 0;
  
    oneInchHoles = count * selectedItemHoles;
    let selectedItemHingeCut = item?.fabrication?.hingeCut > 0 ? item?.fabrication?.hingeCut : 0;
  
    hingeCut = count * selectedItemHingeCut;
     return { oneInchHoles, hingeCut, };
  };