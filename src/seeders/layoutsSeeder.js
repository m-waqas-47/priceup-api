exports.layouts = [
  {
    name: "Door",
    image: "images/layouts/layout_1.png",
    settings: {
      hardwareFinishes: "polished-chrome",
      handles: {
        handleType: "8-x-8-colonial-pull",
        count: 1,
      },
      hinges: {
        hingesType: "std-bevel",
        count: 2,
      },
      pivotHingeOption: {
        pivotHingeType: "pivot-bevel",
        count: 2,
      },
      heavyDutyOption: {
        heavyDutyType: "hvy-square",
        threshold: 85,
        height: 100,
      },
      glassType: {
        type: "clear",
        thickness: "3/8",
      },
      outages: 2,
      transom: "fixed-wall-clamp",
      other: {
        people: 2,
        hours: 2,
      },
      measurementSides: 2,
      priceBySqftFormula:"(a*b)/144"
    },
  },
  {
    name: "Door & Panel",
    image: "images/layouts/layout_2.png",
    settings: {
      hardwareFinishes: "polished-chrome",
      handles: {
        handleType: "8-x-8-d-pull",
        count: 1,
      },
      hinges: {
        hingesType: "std-bevel",
        count: 2,
      },
      pivotHingeOption: {
        pivotHingeType: "hvy-pivot-bevel",
        count: 2,
      },
      heavyDutyOption: {
        heavyDutyType: "hvy-square",
        threshold: 85,
        height: 100,
      },
      channelOrClamps: "Channel",
      mountingChannel: "u-channel-3-8",
      wallClamp: {
        type: "beveled-wall-clamp",
        count: 3,
      },
      glassType: {
        type: "clear",
        thickness: "3/8",
      },
      outages: 2,
      other: {
        people: 2,
        hours: 2,
      },
      measurementSides: 3,
      priceBySqftFormula:"(a*(b+c))/144"
    },
  },
];
