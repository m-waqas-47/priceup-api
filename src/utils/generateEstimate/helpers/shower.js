exports.getShowerHandleFabrication = (item, count) => {
    let oneInchHoles = 0;
    let hingeCut = 0;
    let clampCut = 0;
    let notch = 0;
    let outages = 0;
    let selectedItemHoles = item?.oneInchHoles > 0 ? item?.oneInchHoles : 2;
  
    oneInchHoles = count * selectedItemHoles;
    let selectedItemhingeCut = item?.hingeCut > 0 ? item?.hingeCut : 0;
  
    hingeCut = count * selectedItemhingeCut;
    let selectedItemClampCut = item?.clampCut > 0 ? item?.clampCut : 0;
  
    clampCut = count * selectedItemClampCut;
    let selectedItemNotch = item?.notch > 0 ? item?.notch : 0;
  
    notch = count * selectedItemNotch;
    let selectedItemOutages = item?.outages > 0 ? item?.outages : 0;
  
    outages = count * selectedItemOutages;
    return { oneInchHoles, hingeCut, clampCut, notch, outages };
  };
  
exports.getShowerHingeFabrication = (item, count) => {
    let oneInchHoles = 0;
    let hingeCut = 0;
    let clampCut = 0;
    let notch = 0;
    let outages = 0;
    let selectedItemHoles = item?.oneInchHoles > 0 ? item?.oneInchHoles : 0;
  
    oneInchHoles = count * selectedItemHoles;
    let selectedItemHingeCut = item?.hingeCut > 0 ? item?.hingeCut : 1;
  
    hingeCut = count * selectedItemHingeCut;
    let selectedItemClampCut = item?.clampCut > 0 ? item?.clampCut : 0;
  
    clampCut = count * selectedItemClampCut;
    let selectedItemNotch = item?.notch > 0 ? item?.notch : 0;
  
    notch = count * selectedItemNotch;
    let selectedItemOutages = item?.outages > 0 ? item?.outages : 0;
  
    outages = count * selectedItemOutages;
    return { oneInchHoles, hingeCut, clampCut, notch, outages };
  };
  
exports.getShowerMountingChannelFabrication = (item, count) => {
    let oneInchHoles = 0;
    let hingeCut = 0;
    let clampCut = 0;
    let notch = 0;
    let outages = 0;
    let selectedItemHoles = item?.oneInchHoles > 0 ? item?.oneInchHoles : 0;
  
    oneInchHoles = count * selectedItemHoles;
    let selectedItemHingeCut = item?.hingeCut > 0 ? item?.hingeCut : 0;
  
    hingeCut = count * selectedItemHingeCut;
    let selectedItemClampCut = item?.clampCut > 0 ? item?.clampCut : 0;
  
    clampCut = count * selectedItemClampCut;
    let selectedItemNotch = item?.notch > 0 ? item?.notch : 0;
  
    notch = count * selectedItemNotch;
    let selectedItemOutages = item?.outages > 0 ? item?.outages : 0;
  
    outages = count * selectedItemOutages;
    return { oneInchHoles, hingeCut, clampCut, notch, outages };
  };
  
exports.getShowerMountingClampFabrication = (item, count) => {
    let oneInchHoles = 0;
    let hingeCut = 0;
    let clampCut = 0;
    let notch = 0;
    let outages = 0;
    let selectedItemHoles = item?.oneInchHoles > 0 ? item?.oneInchHoles : 0;
  
    oneInchHoles = count * selectedItemHoles;
    let selectedItemHingeCut = item?.hingeCut > 0 ? item?.hingeCut : 0;
  
    hingeCut = count * selectedItemHingeCut;
    let selectedItemClampCut = item?.clampCut > 0 ? item?.clampCut : 1;
  
    clampCut = count * selectedItemClampCut;
    let selectedItemNotch = item?.notch > 0 ? item?.notch : 0;
  
    notch = count * selectedItemNotch;
    let selectedItemOutages = item?.outages > 0 ? item?.outages : 0;
  
    outages = count * selectedItemOutages;
    return { oneInchHoles, hingeCut, clampCut, notch, outages };
  };
  
exports.getShowerGenericFabrication = (item, count) => {
    let oneInchHoles = 0;
    let hingeCut = 0;
    let clampCut = 0;
    let notch = 0;
    let outages = 0;
    let selectedItemHoles = item?.oneInchHoles > 0 ? item?.oneInchHoles : 0;
  
    oneInchHoles = count * selectedItemHoles;
    let selectedItemHingeCut = item?.hingeCut > 0 ? item?.hingeCut : 0;
  
    hingeCut = count * selectedItemHingeCut;
    let selectedItemClampCut = item?.clampCut > 0 ? item?.clampCut : 0;
  
    clampCut = count * selectedItemClampCut;
    let selectedItemNotch = item?.notch > 0 ? item?.notch : 0;
  
    notch = count * selectedItemNotch;
    let selectedItemOutages = item?.outages > 0 ? item?.outages : 0;
  
    outages = count * selectedItemOutages;
    return { oneInchHoles, hingeCut, clampCut, notch, outages };
  };