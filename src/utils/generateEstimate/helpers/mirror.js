exports.getAreaSqft = (dimensions) => {
    let totalSqft = 0;
    let totalPerimeter = 0;
  
    dimensions.forEach(dimension => {
      const count = dimension.count;
      const width = dimension.width;
      const height = dimension.height;
      for (let i = 0; i < count; i++) {
        const panel = calculatePanel(width, height);
        totalSqft += panel.sqft;
        totalPerimeter += panel.perimeter;
      }
    });
  
    return {
      areaSqft: Math.round((totalSqft + Number.EPSILON) * 100) / 100,
      perimeter: totalPerimeter,
    };
  };

  const calculatePanel = (width, height) => {
    let panelWidth = (width || 0) * 2;
    let panelHeight = (height || 0) * 2;
    let panelSqft = ((width || 0) * (height || 0)) / 144;
    panelSqft = Math.round((panelSqft + Number.EPSILON) * 100) / 100;
    let panelPerimeter = panelWidth + panelHeight;
    return { sqft: panelSqft, perimeter: panelPerimeter };
  };
  