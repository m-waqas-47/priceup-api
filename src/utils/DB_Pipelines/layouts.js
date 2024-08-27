exports.fetchAllRecords = (condition) => {
  const pipeline = [
    {
      $match: condition,
    },
    // Lookup and transform the 'hardwareFinishes'
    {
      $lookup: {
        from: "finishes",
        localField: "settings.hardwareFinishes",
        foreignField: "_id",
        as: "hardwareFinishesDetails",
      },
    },
    {
      $addFields: {
        "settings.hardwareFinishes": {
          $arrayElemAt: [
            {
              $map: {
                input: "$hardwareFinishesDetails",
                as: "item",
                in: {
                  _id: "$$item._id",
                  name: "$$item.name",
                  image: "$$item.image",
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        hardwareFinishesDetails: 0,
      },
    },
    // Lookup and transform the 'handles.handleType'
    {
      $lookup: {
        from: "hardwares",
        localField: "settings.handles.handleType",
        foreignField: "_id",
        as: "handlesDetails",
      },
    },
    {
      $addFields: {
        "settings.handles.handleType": {
          $arrayElemAt: [
            {
              $map: {
                input: "$handlesDetails",
                as: "item",
                in: {
                  _id: "$$item._id",
                  name: "$$item.name",
                  image: "$$item.image",
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        handlesDetails: 0,
      },
    },
    // Lookup and transform the 'hinges.hingesType'
    {
      $lookup: {
        from: "hardwares",
        localField: "settings.hinges.hingesType",
        foreignField: "_id",
        as: "hingesDetails",
      },
    },
    {
      $addFields: {
        "settings.hinges.hingesType": {
          $arrayElemAt: [
            {
              $map: {
                input: "$hingesDetails",
                as: "item",
                in: {
                  _id: "$$item._id",
                  name: "$$item.name",
                  image: "$$item.image",
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        hingesDetails: 0,
      },
    },
    // Lookup and transform the 'pivotHingeOption.pivotHingeType'
    //   {
    //     $lookup: {
    //       from: "hardwares",
    //       localField: "settings.pivotHingeOption.pivotHingeType",
    //       foreignField: "_id",
    //       as: "pivotHingeOptionDetails",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       "settings.pivotHingeOption.pivotHingeType": {
    //         $arrayElemAt: [
    //           {
    //             $map: {
    //               input: "$pivotHingeOptionDetails",
    //               as: "item",
    //               in: {
    //                 _id: "$$item._id",
    //                 name: "$$item.name",
    //                 image: "$$item.image",
    //               },
    //             },
    //           },
    //           0,
    //         ],
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       pivotHingeOptionDetails: 0,
    //     },
    //   },
    // Lookup and transform the 'heavyDutyOption.heavyDutyType'
    {
      $lookup: {
        from: "hardwares",
        localField: "settings.heavyDutyOption.heavyDutyType",
        foreignField: "_id",
        as: "heavyDutyOptionDetails",
      },
    },
    {
      $addFields: {
        "settings.heavyDutyOption.heavyDutyType": {
          $arrayElemAt: [
            {
              $map: {
                input: "$heavyDutyOptionDetails",
                as: "item",
                in: {
                  _id: "$$item._id",
                  name: "$$item.name",
                  image: "$$item.image",
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        heavyDutyOptionDetails: 0,
      },
    },
    // Lookup and transform the 'heavyPivotOption.heavyPivotType'
    //   {
    //     $lookup: {
    //       from: "hardwares",
    //       localField: "settings.heavyPivotOption.heavyPivotType",
    //       foreignField: "_id",
    //       as: "heavyPivotOptionDetails",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       "settings.heavyPivotOption.heavyPivotType": {
    //         $arrayElemAt: [
    //           {
    //             $map: {
    //               input: "$heavyPivotOptionDetails",
    //               as: "item",
    //               in: {
    //                 _id: "$$item._id",
    //                 name: "$$item.name",
    //                 image: "$$item.image",
    //               },
    //             },
    //           },
    //           0,
    //         ],
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       heavyPivotOptionDetails: 0,
    //     },
    //   },
    // Lookup and transform the 'mountingChannel'
    {
      $lookup: {
        from: "hardwares",
        localField: "settings.mountingChannel",
        foreignField: "_id",
        as: "mountingChannelDetails",
      },
    },
    {
      $addFields: {
        "settings.mountingChannel": {
          $arrayElemAt: [
            {
              $map: {
                input: "$mountingChannelDetails",
                as: "item",
                in: {
                  _id: "$$item._id",
                  name: "$$item.name",
                  image: "$$item.image",
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        mountingChannelDetails: 0,
      },
    },
    // Lookup and transform the 'wallClamp.wallClampType'
    {
      $lookup: {
        from: "hardwares",
        localField: "settings.wallClamp.wallClampType",
        foreignField: "_id",
        as: "wallClampDetails",
      },
    },
    {
      $addFields: {
        "settings.wallClamp.wallClampType": {
          $arrayElemAt: [
            {
              $map: {
                input: "$wallClampDetails",
                as: "item",
                in: {
                  _id: "$$item._id",
                  name: "$$item.name",
                  image: "$$item.image",
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        wallClampDetails: 0,
      },
    },
    // Lookup and transform the 'sleeveOver.sleeveOverType'
    {
      $lookup: {
        from: "hardwares",
        localField: "settings.sleeveOver.sleeveOverType",
        foreignField: "_id",
        as: "sleeveOverDetails",
      },
    },
    {
      $addFields: {
        "settings.sleeveOver.sleeveOverType": {
          $arrayElemAt: [
            {
              $map: {
                input: "$sleeveOverDetails",
                as: "item",
                in: {
                  _id: "$$item._id",
                  name: "$$item.name",
                  image: "$$item.image",
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        sleeveOverDetails: 0,
      },
    },
    // Lookup and transform the 'glassToGlass.glassToGlassType'
    {
      $lookup: {
        from: "hardwares",
        localField: "settings.glassToGlass.glassToGlassType",
        foreignField: "_id",
        as: "glassToGlassDetails",
      },
    },
    {
      $addFields: {
        "settings.glassToGlass.glassToGlassType": {
          $arrayElemAt: [
            {
              $map: {
                input: "$glassToGlassDetails",
                as: "item",
                in: {
                  _id: "$$item._id",
                  name: "$$item.name",
                  image: "$$item.image",
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        glassToGlassDetails: 0,
      },
    },
    // Lookup and transform the 'cornerWallClamp.wallClampType'
    {
      $lookup: {
        from: "hardwares",
        localField: "settings.cornerWallClamp.wallClampType",
        foreignField: "_id",
        as: "cornerWallClampDetails",
      },
    },
    {
      $addFields: {
        "settings.cornerWallClamp.wallClampType": {
          $arrayElemAt: [
            {
              $map: {
                input: "$cornerWallClampDetails",
                as: "item",
                in: {
                  _id: "$$item._id",
                  name: "$$item.name",
                  image: "$$item.image",
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        cornerWallClampDetails: 0,
      },
    },
    // Lookup and transform the 'cornerSleeveOver.sleeveOverType'
    {
      $lookup: {
        from: "hardwares",
        localField: "settings.cornerSleeveOver.sleeveOverType",
        foreignField: "_id",
        as: "cornerSleeveOverDetails",
      },
    },
    {
      $addFields: {
        "settings.cornerSleeveOver.sleeveOverType": {
          $arrayElemAt: [
            {
              $map: {
                input: "$cornerSleeveOverDetails",
                as: "item",
                in: {
                  _id: "$$item._id",
                  name: "$$item.name",
                  image: "$$item.image",
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        cornerSleeveOverDetails: 0,
      },
    },
    // Lookup and transform the 'cornerGlassToGlass.glassToGlassType'
    {
      $lookup: {
        from: "hardwares",
        localField: "settings.cornerGlassToGlass.glassToGlassType",
        foreignField: "_id",
        as: "cornerGlassToGlassDetails",
      },
    },
    {
      $addFields: {
        "settings.cornerGlassToGlass.glassToGlassType": {
          $arrayElemAt: [
            {
              $map: {
                input: "$cornerGlassToGlassDetails",
                as: "item",
                in: {
                  _id: "$$item._id",
                  name: "$$item.name",
                  image: "$$item.image",
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        cornerGlassToGlassDetails: 0,
      },
    },
    // Lookup and transform the 'glassType.type'
    {
      $lookup: {
        from: "glasstypes",
        localField: "settings.glassType.type",
        foreignField: "_id",
        as: "glassTypeDetails",
      },
    },
    {
      $addFields: {
        "settings.glassType.type": {
          $arrayElemAt: [
            {
              $map: {
                input: "$glassTypeDetails",
                as: "item",
                in: {
                  _id: "$$item._id",
                  name: "$$item.name",
                  image: "$$item.image",
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        glassTypeDetails: 0,
      },
    },
    // Lookup and transform the 'slidingDoorSystem.type'
    {
      $lookup: {
        from: "hardwares",
        localField: "settings.slidingDoorSystem.type",
        foreignField: "_id",
        as: "slidingDoorSystemDetails",
      },
    },
    {
      $addFields: {
        "settings.slidingDoorSystem.type": {
          $arrayElemAt: [
            {
              $map: {
                input: "$slidingDoorSystemDetails",
                as: "item",
                in: {
                  _id: "$$item._id",
                  name: "$$item.name",
                  image: "$$item.image",
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        slidingDoorSystemDetails: 0,
      },
    },
    // Lookup and transform the 'transom'
    //   {
    //     $lookup: {
    //       from: "hardwares",
    //       localField: "settings.transom",
    //       foreignField: "_id",
    //       as: "transomDetails",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       "settings.transom": {
    //         $arrayElemAt: [
    //           {
    //             $map: {
    //               input: "$transomDetails",
    //               as: "item",
    //               in: {
    //                 _id: "$$item._id",
    //                 name: "$$item.name",
    //                 image: "$$item.image",
    //               },
    //             },
    //           },
    //           0,
    //         ],
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       transomDetails: 0,
    //     },
    //   },
    // Lookup and transform the 'header'
    {
      $lookup: {
        from: "hardwares",
        localField: "settings.header",
        foreignField: "_id",
        as: "headerDetails",
      },
    },
    {
      $addFields: {
        "settings.header": {
          $arrayElemAt: [
            {
              $map: {
                input: "$headerDetails",
                as: "item",
                in: {
                  _id: "$$item._id",
                  name: "$$item.name",
                  image: "$$item.image",
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        headerDetails: 0,
      },
    },
    // Lookup and transform the 'glassAddon'
    {
      $lookup: {
        from: "glassaddons",
        localField: "settings.glassAddon",
        foreignField: "_id",
        as: "glassAddonDetails",
      },
    },
    {
      $addFields: {
        "settings.glassAddon": {
          $arrayElemAt: [
            {
              $map: {
                input: "$glassAddonDetails",
                as: "item",
                in: {
                  _id: "$$item._id",
                  name: "$$item.name",
                  image: "$$item.image",
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        glassAddonDetails: 0,
      },
    },
    {
      $project: {
        // Include all original fields (you can explicitly list them if needed)
        name: 1,
        image: 1,
        company_id: 1,
        settings: 1,
        // Add other fields as necessary
      },
    },
  ];

  return pipeline;
};
