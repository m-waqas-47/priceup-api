const { layoutVariant, showerGlassThicknessTypes, showerWeightMultiplier, wineCellarLayoutVariants } = require("@config/common");

exports.getGlassThickness = (variant, measurementSides, height) => {
    const measurements = convertArrayKeysToObject(measurementSides);
    switch (variant) {
      /** Shower Layouts */
      case layoutVariant.DOOR:
        return measurements?.a < height ? "3/8" : "1/2";
      case layoutVariant.DOORANDPANEL:
        return measurements?.a < height ? "3/8" : "1/2";
      case layoutVariant.DOUBLEDOOR:
        return measurements?.a < height ? "3/8" : "1/2";
      case layoutVariant.DOORANDNIB:
        return measurements?.a < height ? "3/8" : "1/2";
      case layoutVariant.DOORANDNOTCHEDPANEL:
        return measurements?.a < height ? "3/8" : "1/2";
      case layoutVariant.DOORPANELANDRETURN:
        return measurements?.a < height ? "3/8" : "1/2";
      case layoutVariant.DOORNOTCHEDPANELANDRETURN:
        return measurements?.a < height ? "3/8" : "1/2";
      case layoutVariant.SINGLEBARN:
        return measurements?.a < height ? "3/8" : "1/2";
      case layoutVariant.DOUBLEBARN:
        return measurements?.a < height ? "3/8" : "1/2";
      /** end */
      /** Wine Cellar Layouts */
      case wineCellarLayoutVariants.INLINE:
        return measurements?.a < height ? "3/8" : "1/2";
      case wineCellarLayoutVariants.NINTYDEGREE:
        return measurements?.a < height ? "3/8" : "1/2";
      case wineCellarLayoutVariants.THREESIDEDGLASS:
        return measurements?.a < height ? "3/8" : "1/2";
      case wineCellarLayoutVariants.GLASSCUBE:
        return measurements?.a < height ? "3/8" : "1/2";
      /** end */
      default:
        return;
    }
  };
  
const convertArrayKeysToObject = (array) => {
    const result = array.reduce((obj, item) => {
      obj[item.key] = item.value;
      return obj;
  }, {});
  return result;
  };
  
exports.calculateAreaAndPerimeter = (
    measurementSides,
    variant,
    glassThickness = showerGlassThicknessTypes.THREEBYEIGHT,
    layoutConfigs = null
  ) => {
    let measurements =
      variant !== layoutVariant.CUSTOM
        ? convertArrayKeysToObject(measurementSides)
        : null;
    if (variant === layoutVariant.DOOR) {
      const doorQuantity = measurements?.b === 0 ? 0 : 1;
      const door = {
        width: measurements?.b > 0 ? measurements?.b : 0,
        height: doorQuantity === 0 ? 0 : measurements?.a,
      };
      const areaSqft =
        Math.round(((door.width * door.height) / 144) * doorQuantity * 100) / 100;
      const weight = getWeightByThickness(
        layoutVariant.DOOR,
        glassThickness,
        areaSqft
      );
  
      const perimeterDoor = {
        width: door.width * 2 * doorQuantity,
        height: door.height * 2 * doorQuantity,
      };
      const perimeter = perimeterDoor.width + perimeterDoor.height;
      return {
        areaSqft: areaSqft,
        perimeter: perimeter,
        doorWidth: door.width,
        ...weight,
      };
    } else if (variant === layoutVariant.DOORANDPANEL) {
      const doorQuantity = measurements?.b === 0 ? 0 : 1;
      const door = {
        width: measurements?.b > 28 ? 28 : measurements?.b,
        height: doorQuantity === 0 ? 0 : measurements?.a,
      };
      const doorSqft = ((door.width * door.height) / 144) * doorQuantity;
      const panelQuantity = measurements?.b > 28 ? 1 : 0;
      const panel = {
        width:
          door?.width > 28
            ? measurements?.b - door?.width
            : measurements?.b < 29
            ? measurements?.b - door?.width
            : (measurements?.b >= 28 ? measurements?.b - door?.width : 0) < 10
            ? 10
            : measurements?.b >= 28
            ? measurements?.b - door?.width
            : 0,
        height: panelQuantity === 0 ? 0 : measurements?.a,
      };
      const panelSqft = ((panel.width * panel.height) / 144) * panelQuantity;
      const areaSqft = Math.round((doorSqft + panelSqft) * 100) / 100;
      const weight = getWeightByThickness(
        layoutVariant.DOORANDPANEL,
        glassThickness,
        { door: doorSqft, panel: panelSqft }
      );
  
      const perimeterDoor = {
        width: door.width * 2 * doorQuantity,
        height: door.height * 2 * doorQuantity,
      };
      const perimeterPanel = {
        width: panel.width * 2 * panelQuantity,
        height: panel.height * 2 * panelQuantity,
      };
      const perimeter =
        perimeterDoor.width +
        perimeterDoor.height +
        (perimeterPanel.width + perimeterPanel.height);
      return {
        areaSqft: areaSqft,
        perimeter: perimeter,
        doorWidth: door.width,
        panelWidth: panel.width,
        ...weight,
      };
    } else if (variant === layoutVariant.DOUBLEDOOR) {
      const doorLeftQuantity = measurements?.b === 0 ? 0 : 1;
      const doorLeft = {
        width: measurements?.b / 2,
        height: doorLeftQuantity === 0 ? 0 : measurements?.a,
      };
      const doorLeftSqft =
        ((doorLeft.width * doorLeft.height) / 144) * doorLeftQuantity;
      const doorRightQuantity = measurements?.b === 0 ? 0 : 1;
      const doorRight = {
        width: measurements?.b - doorLeft?.width,
        height: doorRightQuantity === 0 ? 0 : measurements?.a,
      };
      const doorRightSqft =
        ((doorRight.width * doorRight.height) / 144) * doorRightQuantity;
      const areaSqft = Math.round((doorLeftSqft + doorRightSqft) * 100) / 100;
      const weight = getWeightByThickness(
        layoutVariant.DOUBLEDOOR,
        glassThickness,
        { doorLeft: doorLeftSqft, doorRight: doorRightSqft }
      );
  
      const perimeterDoorLeft = {
        width: doorLeft.width * 2 * doorLeftQuantity,
        height: doorLeft.height * 2 * doorLeftQuantity,
      };
      const perimeterDoorRight = {
        width: doorRight.width * 2 * doorRightQuantity,
        height: doorRight.height * 2 * doorRightQuantity,
      };
      const perimeter =
        perimeterDoorLeft.width +
        perimeterDoorLeft.height +
        (perimeterDoorRight.width + perimeterDoorRight.height);
      return {
        areaSqft: areaSqft,
        perimeter: perimeter,
        doorWidth: doorLeft.width,
        ...weight,
      };
    } else if (variant === layoutVariant.DOORANDNIB) {
      const doorQuantity = measurements?.b === 0 ? 0 : 1;
      const door = {
        width: measurements?.b,
        height: doorQuantity === 0 ? 0 : measurements?.a,
      };
      const doorSqft = ((door.width * door.height) / 144) * doorQuantity;
      const panelQuantity = measurements?.d === 0 ? 0 : 1;
      const panel = {
        width: measurements?.d,
        height: measurements?.d === 0 ? 0 : measurements?.a - measurements?.c,
      };
      const panelSqft = ((panel.width * panel.height) / 144) * panelQuantity;
      const areaSqft = Math.round((doorSqft + panelSqft) * 100) / 100;
      const weight = getWeightByThickness(
        layoutVariant.DOORANDNIB,
        glassThickness,
        { door: doorSqft, panel: panelSqft }
      );
  
      const perimeterDoor = {
        width: door.width * 2 * doorQuantity,
        height: door.height * 2 * doorQuantity,
      };
      const perimeterPanel = {
        width: panel.width * 2 * panelQuantity,
        height: panel.height * 2 * panelQuantity,
      };
      const perimeter =
        perimeterDoor.width +
        perimeterDoor.height +
        (perimeterPanel.width + perimeterPanel.height);
      return {
        areaSqft: areaSqft,
        perimeter: perimeter,
        doorWidth: door.width,
        panelWidth: panel.width,
        ...weight,
      };
    } else if (variant === layoutVariant.DOORANDNOTCHEDPANEL) {
      const doorQuantity = measurements?.b === 0 ? 0 : 1;
      const door = {
        width: measurements?.b > 28 ? 28 : measurements?.b,
        height: doorQuantity === 0 ? 0 : measurements?.a,
      };
      const doorSqft = ((door.width * door.height) / 144) * doorQuantity;
  
      const panelQuantity = measurements?.b > 28 ? 1 : 0;
      const panel = {
        // have some issue in width
        width:
          door?.width > 28
            ? Number(measurements?.b - door?.width) + Number(measurements?.d)
            : Number(
                measurements?.b < 29
                  ? measurements?.b - door?.width
                  : (measurements?.b >= 28 ? measurements?.b - door?.width : 0) <
                    10
                  ? 10
                  : measurements?.b >= 28
                  ? measurements?.b - door?.width
                  : 0
              ) + Number(measurements?.d),
        height: panelQuantity === 0 ? 0 : measurements?.a,
      };
      const panelSqft = ((panel.width * panel.height) / 144) * panelQuantity;
      const areaSqft = Math.round((doorSqft + panelSqft) * 100) / 100;
      const weight = getWeightByThickness(
        layoutVariant.DOORANDNOTCHEDPANEL,
        glassThickness,
        { door: doorSqft, panel: panelSqft }
      );
  
      const perimeterDoor = {
        width: door.width * 2 * doorQuantity,
        height: door.height * 2 * doorQuantity,
      };
      const perimeterPanel = {
        width: panel.width * 2 * panelQuantity,
        height: panel.height * 2 * panelQuantity,
      };
      const perimeter =
        perimeterDoor.width +
        perimeterDoor.height +
        (perimeterPanel.width + perimeterPanel.height);
  
      return {
        areaSqft: areaSqft,
        perimeter: perimeter,
        doorWidth: door.width,
        panelWidth: panel.width,
        ...weight,
      };
    } else if (variant === layoutVariant.DOORPANELANDRETURN) {
      const doorQuantity = measurements?.b === 0 ? 0 : 1;
      const door = {
        width: measurements?.b > 28 ? 28 : measurements?.b,
        height: doorQuantity === 0 ? 0 : measurements?.a,
      };
      const doorSqft = ((door.width * door.height) / 144) * doorQuantity;
      const panelQuantity = measurements?.b > 28 ? 1 : 0;
      const panel = {
        width:
          door?.width > 28
            ? measurements?.b - door?.width
            : measurements?.b < 29
            ? measurements?.b - door?.width
            : (measurements?.b >= 28 ? measurements?.b - door?.width : 0) < 10
            ? 10
            : measurements?.b >= 28
            ? measurements?.b - door?.width
            : 0,
        height: panelQuantity === 0 ? 0 : measurements?.a,
      };
      const panelSqft = ((panel.width * panel.height) / 144) * panelQuantity;
      const returnQuantity = measurements?.c === 0 ? 0 : 1;
      const layoutReturn = {
        width: measurements?.c === 0 ? 0 : measurements?.c,
        height: returnQuantity === 0 ? 0 : measurements?.a,
      };
      const returnSqft =
        ((layoutReturn.width * layoutReturn.height) / 144) * returnQuantity;
      const areaSqft =
        Math.round((doorSqft + panelSqft + returnSqft) * 100) / 100;
      const weight = getWeightByThickness(
        layoutVariant.DOORPANELANDRETURN,
        glassThickness,
        { door: doorSqft, panel: panelSqft, return: returnSqft }
      );
  
      const perimeterDoor = {
        width: door.width * 2 * doorQuantity,
        height: door.height * 2 * doorQuantity,
      };
      const perimeterPanel = {
        width: panel.width * 2 * panelQuantity,
        height: panel.height * 2 * panelQuantity,
      };
      const perimeterReturn = {
        width: layoutReturn.width * 2 * returnQuantity,
        height: layoutReturn.height * 2 * returnQuantity,
      };
      const perimeter =
        perimeterDoor.width +
        perimeterDoor.height +
        (perimeterPanel.width + perimeterPanel.height) +
        (perimeterReturn.width + perimeterReturn.height);
      return {
        areaSqft: areaSqft,
        perimeter: perimeter,
        doorWidth: door.width,
        panelWidth: panel.width,
        ...weight,
      };
    } else if (variant === layoutVariant.DOORNOTCHEDPANELANDRETURN) {
      const doorQuantity = measurements?.a === 0 ? 0 : 1;
      const door = {
        width: measurements?.a > 28 ? 28 : measurements?.a,
        height: doorQuantity === 0 ? 0 : measurements?.a,
      };
      const doorSqft = ((door.width * door.height) / 144) * doorQuantity;
      const panelQuantity = measurements?.a > 28 ? 1 : 0;
      const panel = {
        width:
          door?.width > 28
            ? Number(measurements?.b - door?.width) + Number(measurements?.d)
            : Number(
                measurements?.b < 29
                  ? measurements?.b - door?.width
                  : (measurements?.b >= 28 ? measurements?.b - door?.width : 0) <
                    10
                  ? 10
                  : measurements?.b >= 28
                  ? measurements?.b - door?.width
                  : 0
              ) + Number(measurements?.d),
        height: panelQuantity === 0 ? 0 : measurements?.a,
      };
      const panelSqft = ((panel.width * panel.height) / 144) * panelQuantity;
      const returnQuantity = measurements?.a === 0 ? 0 : 1;
      const layoutReturn = {
        width: measurements?.e === 0 ? 0 : measurements?.e,
        height: returnQuantity === 0 ? 0 : measurements?.a - measurements?.c,
      };
      const returnSqft =
        ((layoutReturn.width * layoutReturn.height) / 144) * returnQuantity;
      const areaSqft =
        Math.round((doorSqft + panelSqft + returnSqft) * 100) / 100;
      const weight = getWeightByThickness(
        layoutVariant.DOORNOTCHEDPANELANDRETURN,
        glassThickness,
        { door: doorSqft, panel: panelSqft, return: returnSqft }
      );
  
      const perimeterDoor = {
        width: door.width * 2 * doorQuantity,
        height: door.height * 2 * doorQuantity,
      };
      const perimeterPanel = {
        width: panel.width * 2 * panelQuantity,
        height: panel.height * 2 * panelQuantity,
      };
      const perimeterReturn = {
        width: layoutReturn.width * 2 * returnQuantity,
        height: layoutReturn.height * 2 * returnQuantity,
      };
      const perimeter =
        perimeterDoor.width +
        perimeterDoor.height +
        (perimeterPanel.width + perimeterPanel.height) +
        (perimeterReturn.width + perimeterReturn.height);
      return {
        areaSqft: areaSqft,
        perimeter: perimeter,
        doorWidth: door.width,
        panelWidth: panel.width,
        ...weight,
      };
    } else if (variant === layoutVariant.SINGLEBARN) {
      const doorQuantity = measurements?.b === 0 ? 0 : 1;
      const door = {
        width: measurements?.b > 28 ? 28 : measurements?.b,
        height: doorQuantity === 0 ? 0 : measurements?.a,
      };
      const doorSqft = ((door.width * door.height) / 144) * doorQuantity;
      const panelQuantity = measurements?.b > 28 ? 1 : 0;
      const panel = {
        width: measurements?.b - door?.width,
        height: panelQuantity === 0 ? 0 : measurements?.a,
      };
      const panelSqft = ((panel.width * panel.height) / 144) * panelQuantity;
      const areaSqft = Math.round((doorSqft + panelSqft) * 100) / 100;
      const weight = getWeightByThickness(
        layoutVariant.SINGLEBARN,
        glassThickness,
        { door: doorSqft, panel: panelSqft }
      );
  
      const perimeterDoor = {
        width: door.width * 2 * doorQuantity,
        height: door.height * 2 * doorQuantity,
      };
      const perimeterPanel = {
        width: panel.width * 2 * panelQuantity,
        height: panel.height * 2 * panelQuantity,
      };
      const perimeter =
        perimeterDoor.width +
        perimeterDoor.height +
        (perimeterPanel.width + perimeterPanel.height);
      return {
        areaSqft: areaSqft,
        perimeter: perimeter,
        doorWidth: door.width,
        panelWidth: panel.width,
        ...weight,
      };
    } else if (variant === layoutVariant.DOUBLEBARN) {
      const doorLeftQuantity = measurements?.b === 0 ? 0 : 1;
      const doorLeft = {
        width: measurements?.b > 28 ? 28 : measurements?.b,
        height: doorLeftQuantity === 0 ? 0 : measurements?.a,
      };
      const doorLeftSqft =
        ((doorLeft.width * doorLeft.height) / 144) * doorLeftQuantity;
      const doorRightQuantity = measurements?.b > 28 ? 1 : 0;
      const doorRight = {
        width: measurements?.b - doorLeft?.width,
        height: doorRightQuantity === 0 ? 0 : measurements?.a,
      };
      const doorRightSqft =
        ((doorRight.width * doorRight.height) / 144) * doorRightQuantity;
      const areaSqft = Math.round((doorLeftSqft + doorRightSqft) * 100) / 100;
      const weight = getWeightByThickness(
        layoutVariant.DOUBLEBARN,
        glassThickness,
        { doorLeft: doorLeftSqft, doorRight: doorRightSqft }
      );
  
      const perimeterDoorLeft = {
        width: doorLeft.width * 2 * doorLeftQuantity,
        height: doorLeft.height * 2 * doorLeftQuantity,
      };
      const perimeterDoorRight = {
        width: doorRight.width * 2 * doorRightQuantity,
        height: doorRight.height * 2 * doorRightQuantity,
      };
      const perimeter =
        perimeterDoorLeft.width +
        perimeterDoorLeft.height +
        (perimeterDoorRight.width + perimeterDoorRight.height);
      return {
        areaSqft: areaSqft,
        perimeter: perimeter,
        doorWidth: doorLeft.width,
        panelWidth: doorRight.width,
        ...weight,
      };
    } else if (variant === layoutVariant.CUSTOM) {
      measurements = measurementSides;
      let totalSqft = 0;
      let totalPerimeter = 0;
      let panelWeight = "";
  
      // for (const panelKey in measurements) {
      Object.entries(measurements).forEach(([key, value]) => {
        const count = value["count"];
        const width = value["width"];
        const height = value["height"];
        for (let i = 0; i < count; i++) {
          const panel = calculatePanel(width, height);
          totalSqft += panel.sqft;
          totalPerimeter += panel.perimeter;
          panelWeight += getWeightByThickness(
            layoutVariant.CUSTOM,
            glassThickness,
            panel.sqft
          );
        }
      });
      // const { width, height } = measurements[panelKey];
  
      // }
  
      return {
        areaSqft: Math.round((totalSqft + Number.EPSILON) * 100) / 100,
        perimeter: totalPerimeter,
        panelWeight: panelWeight,
      };
    } 
    
    else if (variant === wineCellarLayoutVariants.INLINE) {
      const doorQuantity = measurements?.b === 0 ? 0 : layoutConfigs?.doorQuantity;
      const door = {
        width: measurements?.b > 28 ? 28 : measurements?.b,
        height: doorQuantity === 0 ? 0 : measurements?.a,
      };
      const doorSqft = ((door.width * door.height) / 144) * doorQuantity;
      const panelQuantity = measurements?.b > 28 ? 1 : 0;
      const panel = {
        width: measurements?.b - (door.width * doorQuantity),
        height: panelQuantity === 0 ? 0 : measurements?.a,
      };
      const panelSqft = ((panel.width * panel.height) / 144) * panelQuantity;
      const areaSqft = Math.round((doorSqft + panelSqft) * 100) / 100;
      const weight = getWeightByThickness(
        wineCellarLayoutVariants.INLINE,
        glassThickness,
        { door: doorSqft, panel: panelSqft }
      );
  
      const perimeterDoor = {
        width: door.width * 2 * doorQuantity,
        height: door.height * 2 * doorQuantity,
      };
      const perimeterPanel = {
        width: panel.width * 2 * panelQuantity,
        height: panel.height * 2 * panelQuantity,
      };
      const perimeter =
        perimeterDoor.width +
        perimeterDoor.height +
        (perimeterPanel.width + perimeterPanel.height);
      return {
        areaSqft: areaSqft,
        perimeter: perimeter,
        doorWidth: door.width,
        panelWidth: panel.width,
        ...weight,
      };
    }
    else if (variant === wineCellarLayoutVariants.NINTYDEGREE) {
      const doorQuantity = measurements?.b === 0 ? 0 : layoutConfigs?.doorQuantity;
      const door = {
        width: measurements?.b > 28 ? 28 : measurements?.b,
        height: doorQuantity === 0 ? 0 : measurements?.a,
      };
      const doorSqft = ((door.width * door.height) / 144) * doorQuantity;
      const panelQuantity = measurements?.b > 28 ? 1 : 0;
      const panel = {
        width:measurements?.b - (door.width * doorQuantity),
        height: panelQuantity === 0 ? 0 : measurements?.a,
      };
      const panelSqft = ((panel.width * panel.height) / 144) * panelQuantity;
      const returnQuantity = measurements?.c === 0 ? 0 : 1;
      const layoutReturn = {
        width: measurements?.c === 0 ? 0 : measurements?.c,
        height: returnQuantity === 0 ? 0 : measurements?.a,
      };
      const returnSqft =
        ((layoutReturn.width * layoutReturn.height) / 144) * returnQuantity;
      const areaSqft =
        Math.round((doorSqft + panelSqft + returnSqft) * 100) / 100;
      const weight = getWeightByThickness(
        wineCellarLayoutVariants.NINTYDEGREE,
        glassThickness,
        { door: doorSqft, panel: panelSqft, return: returnSqft }
      );
  
      const perimeterDoor = {
        width: door.width * 2 * doorQuantity,
        height: door.height * 2 * doorQuantity,
      };
      const perimeterPanel = {
        width: panel.width * 2 * panelQuantity,
        height: panel.height * 2 * panelQuantity,
      };
      const perimeterReturn = {
        width: layoutReturn.width * 2 * returnQuantity,
        height: layoutReturn.height * 2 * returnQuantity,
      };
      const perimeter =
        perimeterDoor.width +
        perimeterDoor.height +
        (perimeterPanel.width + perimeterPanel.height) +
        (perimeterReturn.width + perimeterReturn.height);
      return {
        areaSqft: areaSqft,
        perimeter: perimeter,
        doorWidth: door.width,
        panelWidth: panel.width,
        ...weight,
      };
    }
    else if (variant === wineCellarLayoutVariants.THREESIDEDGLASS) {
      const doorQuantity = measurements?.b === 0 ? 0 : layoutConfigs?.doorQuantity;
      const door = {
        width: measurements?.b > 28 ? 28 : measurements?.b,
        height: doorQuantity === 0 ? 0 : measurements?.a,
      };
      const doorSqft = ((door.width * door.height) / 144) * doorQuantity;
      const panelQuantity = measurements?.b > 28 ? 1 : 0;
      const panel = {
        width:measurements?.b - (door.width * doorQuantity),
        height: panelQuantity === 0 ? 0 : measurements?.a,
      };
      const panelSqft = ((panel.width * panel.height) / 144) * panelQuantity;
      const return1Quantity = measurements?.c === 0 ? 0 : 1;
      const layoutReturn1 = {
        width: measurements?.c === 0 ? 0 : measurements?.c,
        height: return1Quantity === 0 ? 0 : measurements?.a,
      };
      const return1Sqft =
        ((layoutReturn1.width * layoutReturn1.height) / 144) * return1Quantity;
      const return2Quantity = measurements?.c === 0 ? 0 : 1;
      const layoutReturn2 = {
        width: measurements?.c === 0 ? 0 : measurements?.c,
        height: return2Quantity === 0 ? 0 : measurements?.a,
      };
      const return2Sqft =
        ((layoutReturn2.width * layoutReturn2.height) / 144) * return2Quantity;
      const areaSqft =
        Math.round((doorSqft + panelSqft + return1Sqft + return2Sqft) * 100) / 100;
      const weight = getWeightByThickness(
        wineCellarLayoutVariants.NINTYDEGREE,
        glassThickness,
        { door: doorSqft, panel: panelSqft, return: return1Sqft + return2Sqft }
      );
  
      const perimeterDoor = {
        width: door.width * 2 * doorQuantity,
        height: door.height * 2 * doorQuantity,
      };
      const perimeterPanel = {
        width: panel.width * 2 * panelQuantity,
        height: panel.height * 2 * panelQuantity,
      };
      const perimeterReturn1 = {
        width: layoutReturn1.width * 2 * return1Quantity,
        height: layoutReturn1.height * 2 * return1Quantity,
      };
      const perimeterReturn2 = {
        width: layoutReturn2.width * 2 * return2Quantity,
        height: layoutReturn2.height * 2 * return2Quantity,
      };
      const perimeter =
        perimeterDoor.width +
        perimeterDoor.height +
        (perimeterPanel.width + perimeterPanel.height) +
        (perimeterReturn1.width + perimeterReturn1.height) +
        (perimeterReturn2.width + perimeterReturn2.height);
      return {
        areaSqft: areaSqft,
        perimeter: perimeter,
        doorWidth: door.width,
        panelWidth: panel.width,
        ...weight,
      };
    }
    else if (variant === wineCellarLayoutVariants.GLASSCUBE) {
      const doorQuantity = measurements?.b === 0 ? 0 : layoutConfigs?.doorQuantity;
      const door = {
        width: measurements?.b > 28 ? 28 : measurements?.b,
        height: doorQuantity === 0 ? 0 : measurements?.a,
      };
      const doorSqft = ((door.width * door.height) / 144) * doorQuantity;
      const panelQuantity = measurements?.b > 28 ? 1 : 0;
      const panel = {
        width:measurements?.b - (door.width * doorQuantity),
        height: panelQuantity === 0 ? 0 : measurements?.a,
      };
      const panelSqft = ((panel.width * panel.height) / 144) * panelQuantity;
      const return1Quantity = measurements?.c === 0 ? 0 : 1;
      const layoutReturn1 = {
        width: measurements?.c === 0 ? 0 : measurements?.c,
        height: return1Quantity === 0 ? 0 : measurements?.a,
      };
      const return1Sqft =
        ((layoutReturn1.width * layoutReturn1.height) / 144) * return1Quantity;
      const return2Quantity = measurements?.c === 0 ? 0 : 1;
      const layoutReturn2 = {
        width: measurements?.c === 0 ? 0 : measurements?.c,
        height: return2Quantity === 0 ? 0 : measurements?.a,
      };
      const return2Sqft =
        ((layoutReturn2.width * layoutReturn2.height) / 144) * return2Quantity;
      const backWallGlassQuantity = measurements?.b === 0 ? 0 : 1;
      const backWallGlass = {
        width: measurements?.b === 0 ? 0 : measurements?.b,
        height: measurements?.a === 0 ? 0 : measurements?.a
      }
      const backWallGlassSqft = ((backWallGlass.width * backWallGlass.height) / 144) * backWallGlassQuantity;
      const areaSqft =
        Math.round((doorSqft + panelSqft + return1Sqft + return2Sqft + backWallGlassSqft) * 100) / 100;
      const weight = getWeightByThickness(
        wineCellarLayoutVariants.GLASSCUBE,
        glassThickness,
        { door: doorSqft, panel: panelSqft, return: return1Sqft + return2Sqft, backWallGlass: backWallGlassSqft }
      );
  
      const perimeterDoor = {
        width: door.width * 2 * doorQuantity,
        height: door.height * 2 * doorQuantity,
      };
      const perimeterPanel = {
        width: panel.width * 2 * panelQuantity,
        height: panel.height * 2 * panelQuantity,
      };
      const perimeterReturn1 = {
        width: layoutReturn1.width * 2 * return1Quantity,
        height: layoutReturn1.height * 2 * return1Quantity,
      };
      const perimeterReturn2 = {
        width: layoutReturn2.width * 2 * return2Quantity,
        height: layoutReturn2.height * 2 * return2Quantity,
      };
      const perimeterBackWallGlass = {
        width: backWallGlass.width * 2 * backWallGlassQuantity,
        height: backWallGlass.height * 2 * backWallGlassQuantity,
      };
      const perimeter =
        perimeterDoor.width +
        perimeterDoor.height +
        (perimeterPanel.width + perimeterPanel.height) +
        (perimeterReturn1.width + perimeterReturn1.height) +
        (perimeterReturn2.width + perimeterReturn2.height) +
        (perimeterBackWallGlass.width + perimeterBackWallGlass.height);
      return {
        areaSqft: areaSqft,
        perimeter: perimeter,
        doorWidth: door.width,
        panelWidth: panel.width,
        ...weight,
      };
    }
    else {
      return 0;
    }
  };
  
const getweightMultiplier = (thickness) => {
    switch (thickness) {
      case showerGlassThicknessTypes.ONEBYTWO:
        return showerWeightMultiplier.ONEBYTWO;
      case showerGlassThicknessTypes.THREEBYEIGHT:
        return showerWeightMultiplier.THREEBYEIGHT;
      default:
        return showerWeightMultiplier.THREEBYEIGHT;
    }
  };
  
const getWeightByThickness = (variant, glassThickness, sqft) => {
    const weightMultiplier = getweightMultiplier(glassThickness);
    let doorWeight = 0;
    let panelWeight = 0;
    let returnWeight = 0;
    let doorLeftWeight = 0;
    let doorRightWeight = 0;
    let backWallGlassWeight = 0;
    switch (variant) {
      /** Shower layouts */
      case layoutVariant.DOOR:
        doorWeight = Number((weightMultiplier * sqft)?.toFixed(2));
        return { doorWeight };
      case layoutVariant.DOORANDPANEL:
        doorWeight = Number((weightMultiplier * sqft.door)?.toFixed(2));
        panelWeight = Number((weightMultiplier * sqft.panel)?.toFixed(2));
        return { doorWeight, panelWeight };
      case layoutVariant.DOUBLEDOOR:
        doorLeftWeight = Number((weightMultiplier * sqft.doorLeft)?.toFixed(2));
        doorRightWeight = Number((weightMultiplier * sqft.doorRight)?.toFixed(2));
        return { doorWeight: `${doorLeftWeight}, ${doorRightWeight}` };
      case layoutVariant.DOORANDNIB:
        doorWeight = Number((weightMultiplier * sqft.door)?.toFixed(2));
        panelWeight = Number((weightMultiplier * sqft.panel)?.toFixed(2));
        return { doorWeight, panelWeight };
      case layoutVariant.DOORANDNOTCHEDPANEL:
        doorWeight = Number((weightMultiplier * sqft.door)?.toFixed(2));
        panelWeight = Number((weightMultiplier * sqft.panel)?.toFixed(2));
        return { doorWeight, panelWeight };
      case layoutVariant.DOORPANELANDRETURN:
        doorWeight = Number((weightMultiplier * sqft.door)?.toFixed(2));
        panelWeight = Number((weightMultiplier * sqft.panel)?.toFixed(2));
        returnWeight = Number((weightMultiplier * sqft.return)?.toFixed(2));
        return { doorWeight, panelWeight, returnWeight };
      case layoutVariant.DOORNOTCHEDPANELANDRETURN:
        doorWeight = Number((weightMultiplier * sqft.door)?.toFixed(2));
        panelWeight = Number((weightMultiplier * sqft.panel)?.toFixed(2));
        returnWeight = Number((weightMultiplier * sqft.return)?.toFixed(2));
        return { doorWeight, panelWeight, returnWeight };
      case layoutVariant.SINGLEBARN:
        doorWeight = Number((weightMultiplier * sqft.door)?.toFixed(2));
        panelWeight = Number((weightMultiplier * sqft.panel)?.toFixed(2));
        return { doorWeight, panelWeight };
      case layoutVariant.DOUBLEBARN:
        doorLeftWeight = Number((weightMultiplier * sqft.doorLeft)?.toFixed(2));
        doorRightWeight = Number((weightMultiplier * sqft.doorRight)?.toFixed(2));
        return { doorWeight: `${doorLeftWeight}, ${doorRightWeight}` };
      case layoutVariant.CUSTOM:
        return `${Number((weightMultiplier * sqft)?.toFixed(2))}, `;
      /** end */
      /** Wine Cellar layouts */
      case wineCellarLayoutVariants.INLINE:
        doorWeight = Number((weightMultiplier * sqft.door)?.toFixed(2));
        panelWeight = Number((weightMultiplier * sqft.panel)?.toFixed(2));
        return { doorWeight, panelWeight };
      case wineCellarLayoutVariants.NINTYDEGREE:
        doorWeight = Number((weightMultiplier * sqft.door)?.toFixed(2));
        panelWeight = Number((weightMultiplier * sqft.panel)?.toFixed(2));
        returnWeight = Number((weightMultiplier * sqft.return)?.toFixed(2));
        return { doorWeight, panelWeight, returnWeight };
      case wineCellarLayoutVariants.THREESIDEDGLASS:
        doorWeight = Number((weightMultiplier * sqft.door)?.toFixed(2));
        panelWeight = Number((weightMultiplier * sqft.panel)?.toFixed(2));
        returnWeight = Number((weightMultiplier * sqft.return)?.toFixed(2));
        return { doorWeight, panelWeight, returnWeight };
      case wineCellarLayoutVariants.GLASSCUBE:
        doorWeight = Number((weightMultiplier * sqft.door)?.toFixed(2));
        panelWeight = Number((weightMultiplier * sqft.panel)?.toFixed(2));
        returnWeight = Number((weightMultiplier * sqft.return)?.toFixed(2));
        backWallGlassWeight = Number((weightMultiplier * sqft.backWallGlass)?.toFixed(2));
        return { doorWeight, panelWeight, returnWeight, backWallGlassWeight };
      /** end */
      default:
        return {};
    }
  };