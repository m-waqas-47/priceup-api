const { wineCellarLayoutVariants } = require("@config/common");

exports.wineCellarLayouts = [
  {
    name: "Inline",
    image: "images/wineCellarLayouts/layout_01.png",
    settings: {
      hardwareFinishes: "polished-chrome",
      handles: {
        handleType: "12-inch-round-ladder-pull",
        count: 1,
      },
      hinges: {
        hingesType: "standard-pivot-hinge",
        count: 2,
      },
      glassType: {
        type: "clear",
        thickness: "3/8",
      },
      heavyDutyOption: {
        heavyDutyType: "hvy-pivot-bevel",
        threshold: 85,
        height: 100,
      },
      channelOrClamps: "Channel",
      mountingChannel: "u-channel-3-8",
      doorLock: {
        type: "lock",
        count: 1,
      },
      other: {
        people: 2,
        hours: 2,
      },
      variant: wineCellarLayoutVariants.INLINE,
    },
  },
  {
    name: "90 Degree",
    image: "images/wineCellarLayouts/layout_02.png",
    settings: {
      hardwareFinishes: "polished-chrome",
      handles: {
        handleType: "12-inch-round-ladder-pull",
        count: 1,
      },
      hinges: {
        hingesType: "standard-pivot-hinge",
        count: 2,
      },
      glassType: {
        type: "clear",
        thickness: "3/8",
      },
      heavyDutyOption: {
        heavyDutyType: "hvy-pivot-bevel",
        threshold: 85,
        height: 100,
      },
      channelOrClamps: "Channel",
      mountingChannel: "u-channel-3-8",
      doorLock: {
        type: "lock",
        count: 1,
      },
      other: {
        people: 2,
        hours: 2,
      },
      variant: wineCellarLayoutVariants.NINTYDEGREE,
    },
  },
  {
    name: "3 Sided Glass",
    image: "images/wineCellarLayouts/layout_03.png",
    settings: {
      hardwareFinishes: "polished-chrome",
      handles: {
        handleType: "12-inch-round-ladder-pull",
        count: 1,
      },
      hinges: {
        hingesType: "standard-pivot-hinge",
        count: 2,
      },
      glassType: {
        type: "clear",
        thickness: "3/8",
      },
      heavyDutyOption: {
        heavyDutyType: "hvy-pivot-bevel",
        threshold: 85,
        height: 100,
      },
      channelOrClamps: "Channel",
      mountingChannel: "u-channel-3-8",
      doorLock: {
        type: "lock",
        count: 1,
      },
      other: {
        people: 2,
        hours: 2,
      },
      variant: wineCellarLayoutVariants.THREESIDEDGLASS,
    },
  },
  {
    name: "Glass Cube",
    image: "images/wineCellarLayouts/layout_04.png",
    settings: {
      hardwareFinishes: "polished-chrome",
      handles: {
        handleType: "12-inch-round-ladder-pull",
        count: 1,
      },
      hinges: {
        hingesType: "standard-pivot-hinge",
        count: 2,
      },
      glassType: {
        type: "clear",
        thickness: "3/8",
      },
      heavyDutyOption: {
        heavyDutyType: "hvy-pivot-bevel",
        threshold: 85,
        height: 100,
      },
      channelOrClamps: "Channel",
      mountingChannel: "u-channel-3-8",
      doorLock: {
        type: "lock",
        count: 1,
      },
      other: {
        people: 2,
        hours: 2,
      },
      variant: wineCellarLayoutVariants.GLASSCUBE,
    },
  },
];
