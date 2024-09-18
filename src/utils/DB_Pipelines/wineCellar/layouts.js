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
