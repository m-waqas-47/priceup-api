const { layoutVariant } = require("../config/common");

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
      variant: layoutVariant.DOOR,
      // priceBySqftFormula: "(a*b)/144",
      // perimeterFormula: "(a+b)*2",
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
      // wallClamp: {
      //   wallClampType: "beveled-wall-clamp",
      //   count: 3,
      // },
      glassType: {
        type: "clear",
        thickness: "3/8",
      },
      outages: 2,
      other: {
        people: 2,
        hours: 2,
      },
      measurementSides: 2,
      variant: layoutVariant.DOORANDPANEL,
      // priceBySqftFormula: "((c+b)*a)/144",
      // perimeterFormula: "((b+c+a)*2)+a+a",
    },
  },
  {
    name: "Double Door",
    image: "images/layouts/layout_3.png",
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
      // channelOrClamps: "Channel",
      // mountingChannel: "u-channel-3-8",
      // wallClamp: {
      //   wallClampType: "beveled-wall-clamp",
      //   count: 3,
      // },
      glassType: {
        type: "clear",
        thickness: "3/8",
      },
      outages: 2,
      other: {
        people: 2,
        hours: 2,
      },
      measurementSides: 2,
      variant: layoutVariant.DOUBLEDOOR,
      // priceBySqftFormula: "((c+b)*a)/144",
      // perimeterFormula: "((b+c+a)*2)+a+a",
    },
  },
  {
    name: "Door & Nib",
    image: "images/layouts/layout_4.png",
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
      channelOrClamps: "Channel",
      mountingChannel: "u-channel-3-8",
      glassType: {
        type: "clear",
        thickness: "3/8",
      },
      outages: 1,
      other: {
        people: 2,
        hours: 2,
      },
      measurementSides: 4,
      variant: layoutVariant.DOORANDNIB,
      // priceBySqftFormula: "((b*a)/144*1)+((d*c)/144*1)",
      // perimeterFormula: "(b*2*1)+(a*2*1)+(d*2*1)+(c*2*1)",
    },
  },
  {
    name: "Door & Notched Panel",
    image: "images/layouts/layout_5.png",
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
      channelOrClamps: "Channel",
      mountingChannel: "u-channel-3-8",
      glassType: {
        type: "clear",
        thickness: "3/8",
      },
      outages: 2,
      other: {
        people: 2,
        hours: 2,
      },
      measurementSides: 4,
      variant: layoutVariant.DOORANDNOTCHEDPANEL,
      // priceBySqftFormula: "((b*a)/144*1)+((d*c)/144*1)",
      // perimeterFormula: "(b*2*1)+(a*2*1)+(d*2*1)+(c*2*1)",
    },
  },
  {
    name: "Door Panel & Return",
    image: "images/layouts/layout_6.png",
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
      cornerGlassToGlass: {
        glassToGlassType: "corner-clamp",
        count: 1,
      },
      glassType: {
        type: "clear",
        thickness: "3/8",
      },
      glassAddon: "no-treatment",
      outages: 3,
      other: {
        people: 2,
        hours: 3,
      },
      measurementSides: 3,
      variant: layoutVariant.DOORPANELANDRETURN,
      // priceBySqftFormula: "((d+c+b)*a)/144",
      // perimeterFormula: "((d+c+b+a)*2)+a+a+a+a",
    },
  },
  {
    name: "Door Notched Panel & Return",
    image: "images/layouts/layout_7.png",
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
      channelOrClamps: "Channel",
      mountingChannel: "u-channel-3-8",
      cornerGlassToGlass: {
        glassToGlassType: "corner-clamp",
        count: 1,
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
      measurementSides: 5,
      variant: layoutVariant.DOORNOTCHEDPANELANDRETURN,
      // priceBySqftFormula: "((b*a)/144*1)+((d*c)/144*1)",
      // perimeterFormula: "(b*2*1)+(a*2*1)+(d*2*1)+(c*2*1)",
    },
  },
  {
    name: "Single Barn",
    image: "images/layouts/layout_8.png",
    settings: {
      hardwareFinishes: "polished-chrome",
      handles: {
        handleType: "8-x-8-d-pull",
        count: 1,
      },
      channelOrClamps: "Channel",
      mountingChannel: "u-channel-3-8",
      glassType: {
        type: "clear",
        thickness: "3/8",
      },
      slidingDoorSystem: {
        type: "cardinal-skyline-60",
        count: 1,
      },
      outages: 2,
      other: {
        people: 2,
        hours: 2,
      },
      measurementSides: 2,
      variant: layoutVariant.SINGLEBARN,
      // priceBySqftFormula: "((c+b)*a)/144",
      // perimeterFormula: "((c+b+a)*2)+a+a",
    },
  },
  {
    name: "Double Barn",
    image: "images/layouts/layout_9.png",
    settings: {
      hardwareFinishes: "polished-chrome",
      handles: {
        handleType: "8-x-8-d-pull",
        count: 1,
      },
      // channelOrClamps: "Clamps",
      // wallClamp: {
      //   wallClampType: "beveled-wall-clamp",
      //   count: 2,
      // },
      glassType: {
        type: "clear",
        thickness: "3/8",
      },
      slidingDoorSystem: {
        type: "cardinal-skyline-60",
        count: 1,
      },
      outages: 2,
      other: {
        people: 2,
        hours: 2,
      },
      measurementSides: 2,
      variant: layoutVariant.DOUBLEBARN,
      // priceBySqftFormula: "((c+b)*a)/144",
      // perimeterFormula: "((c+b+a)*2)+a+a",
    },
  },
];
