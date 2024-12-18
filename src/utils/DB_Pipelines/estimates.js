const { default: mongoose } = require("mongoose");

exports.fetchAllRecords = (condition, search, options) => {
  return [
    // Match the specific condition
    {
      $match: condition,
    },
    // Lookup to join project details
    {
      $lookup: {
        from: "projects",
        localField: "project_id",
        foreignField: "_id",
        as: "projectDetails",
      },
    },
    {
      $unwind: {
        path: "$projectDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    // Add conditional field for actualCustomerId
    {
      $addFields: {
        actualCustomerId: {
          $cond: {
            if: { $gt: ["$customer_id", null] },
            then: "$customer_id",
            else: "$projectDetails.customer_id",
          },
        },
      },
    },
    // Lookup customer details
    {
      $lookup: {
        from: "customers",
        localField: "actualCustomerId",
        foreignField: "_id",
        as: "customerDetails",
      },
    },
    {
      $unwind: {
        path: "$customerDetails",
        preserveNullAndEmptyArrays: false,
      },
    },
    // Lookup company details
    {
      $lookup: {
        from: "companies",
        localField: "company_id",
        foreignField: "_id",
        as: "companyDetails",
      },
    },
    {
      $unwind: {
        path: "$companyDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    // Lookup for layouts if category is 'showers'
    {
      $lookup: {
        from: "layouts",
        let: { layoutId: "$config.layout_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$_id", { $toObjectId: "$$layoutId" }] }],
              },
            },
          },
        ],
        as: "layoutDetailsShowers",
      },
    },
    // Lookup for wine cellar layouts if category is 'wineCellars'
    {
      $lookup: {
        from: "wine_cellar_layouts",
        let: { layoutId: "$config.layout_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$layoutId" }],
              },
            },
          },
        ],
        as: "layoutDetailsWineCellars",
      },
    },
    // Add conditional settings field based on the layout lookup results
    {
      $addFields: {
        settings: {
          $switch: {
            branches: [
              // Case for 'showers' category
              {
                case: { $eq: ["$category", "showers"] },
                then: {
                  $cond: {
                    if: { $gt: [{ $size: "$layoutDetailsShowers" }, 0] }, // If there are shower layouts
                    then: {
                      measurementSides: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.measurementSides",
                          0,
                        ],
                      },
                      image: {
                        $arrayElemAt: ["$layoutDetailsShowers.image", 0],
                      },
                      name: { $arrayElemAt: ["$layoutDetailsShowers.name", 0] },
                      _id: { $arrayElemAt: ["$layoutDetailsShowers._id", 0] },
                      variant: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.variant",
                          0,
                        ],
                      },
                      heavyDutyOption: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.heavyDutyOption",
                          0,
                        ],
                      },
                      hinges: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.hinges",
                          0,
                        ],
                      },
                      handles: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.handles",
                          0,
                        ],
                      },
                      glassType: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.glassType",
                          0,
                        ],
                      }, // Setting glassType from layout
                    },
                    else: null, // If no matching layout, set to null
                  },
                },
              },
              // Case for 'wineCellars' category
              {
                case: { $eq: ["$category", "wineCellars"] },
                then: {
                  $cond: {
                    if: { $gt: [{ $size: "$layoutDetailsWineCellars" }, 0] }, // If there are wine cellar layouts
                    then: {
                      measurementSides: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.measurementSides",
                          0,
                        ],
                      },
                      noOfHoursToCompleteSingleDoor: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.noOfHoursToCompleteSingleDoor",
                          0,
                        ],
                      },
                      image: {
                        $arrayElemAt: ["$layoutDetailsWineCellars.image", 0],
                      },
                      name: {
                        $arrayElemAt: ["$layoutDetailsWineCellars.name", 0],
                      },
                      _id: {
                        $arrayElemAt: ["$layoutDetailsWineCellars._id", 0],
                      },
                      variant: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.variant",
                          0,
                        ],
                      },
                      heavyDutyOption: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.heavyDutyOption",
                          0,
                        ],
                      },
                      hinges: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.hinges",
                          0,
                        ],
                      },
                      handles: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.handles",
                          0,
                        ],
                      },
                      doorLock: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.doorLock",
                          0,
                        ],
                      },
                      glassType: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.glassType",
                          0,
                        ],
                      }, // Setting glassType from layout
                    },
                    else: null, // If no matching layout, set to null
                  },
                },
              },
            ],
            default: null,
          },
        },
      },
    },
    // Conditional lookup for creator details
    {
      $lookup: {
        from: "users",
        localField: "creator_id",
        foreignField: "_id",
        as: "adminDetails",
      },
    },
    {
      $lookup: {
        from: "staffs",
        localField: "creator_id",
        foreignField: "_id",
        as: "staffDetails",
      },
    },
    {
      $lookup: {
        from: "customusers",
        localField: "creator_id",
        foreignField: "_id",
        as: "customadminDetails",
      },
    },
    {
      $addFields: {
        creatorDetails: {
          $switch: {
            branches: [
              {
                case: { $eq: ["$creator_type", "admin"] },
                then: { $arrayElemAt: ["$adminDetails", 0] },
              },
              {
                case: { $eq: ["$creator_type", "staff"] },
                then: { $arrayElemAt: ["$staffDetails", 0] },
              },
              {
                case: { $eq: ["$creator_type", "custom_admin"] },
                then: { $arrayElemAt: ["$customadminDetails", 0] },
              },
            ],
            default: null,
          },
        },
      },
    },
    // Match based on search term
    ...(search && search.trim() !== ""
      ? [
          {
            $match: {
              "customerDetails.name": { $regex: search, $options: "i" },
            },
          },
        ]
      : []),
    // Sort first by createdAt
    {
      $sort: { createdAt: -1 }
    },
    {
      $facet: {
        totalRecords: [{ $count: "count" }],
        estimates: [
          {
            $project: {
              name: 1,
              label: 1,
              category: 1,
              status: 1,
              cost: 1,
              config: 1,
              createdAt: 1,
              updatedAt: 1,
              creatorData: "$creatorDetails",
              customerData: "$customerDetails",
              companyData: "$companyDetails",
              settings: 1,
              project_id: 1,
            },
          },
          ...(options.skip > 0 ? [{ $skip: options.skip }] : []),
          ...(options.limit > 0 ? [{ $limit: options.limit }] : []),
        ],
      },
    },
    {
      $project: {
        totalRecords: { $arrayElemAt: ["$totalRecords.count", 0] },
        estimates: 1,
      },
    },
  ];
};

exports.fetchAllRecordsByCustomer = (
  condition,
  search,
  options,
  customerId
) => {
  return [
    // Match the specific condition
    {
      $match: condition,
    },
    // Lookup to join project details
    {
      $lookup: {
        from: "projects",
        localField: "project_id",
        foreignField: "_id",
        as: "projectDetails",
      },
    },
    // Unwind the projectDetails array
    {
      $unwind: {
        path: "$projectDetails",
        preserveNullAndEmptyArrays: true, // Allow for estimates without projects
      },
    },
    // Add a conditional field to determine the source of customer_id
    {
      $addFields: {
        actualCustomerId: {
          $cond: {
            if: { $gt: ["$customer_id", null] }, // Check if customer_id exists in estimates
            then: "$customer_id",
            else: "$projectDetails.customer_id",
          },
        },
      },
    },
    // Match estimates by customer_id if it exists in the projectDetails
    {
      $match: {
        actualCustomerId: new mongoose.Types.ObjectId(customerId), // Assuming `customerId` is passed into the pipeline
      },
    },
    // Lookup to join customer details based on actualCustomerId
    {
      $lookup: {
        from: "customers",
        localField: "actualCustomerId",
        foreignField: "_id",
        as: "customerDetails",
      },
    },
    // Unwind the customerDetails array
    {
      $unwind: {
        path: "$customerDetails",
        preserveNullAndEmptyArrays: false, // Only include projects with matching customers
      },
    },

    // Lookup to join company details
    {
      $lookup: {
        from: "companies",
        localField: "company_id",
        foreignField: "_id",
        as: "companyDetails",
      },
    },
    {
      $unwind: {
        path: "$companyDetails",
        preserveNullAndEmptyArrays: true,
      },
    },

    // Lookup for layouts if category is 'showers'
    {
      $lookup: {
        from: "layouts",
        let: { layoutId: "$config.layout_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$_id", { $toObjectId: "$$layoutId" }] }],
              },
            },
          },
        ],
        as: "layoutDetailsShowers",
      },
    },
    // Lookup for wine cellar layouts if category is 'wineCellars'
    {
      $lookup: {
        from: "wine_cellar_layouts",
        let: { layoutId: "$config.layout_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$layoutId" }],
              },
            },
          },
        ],
        as: "layoutDetailsWineCellars",
      },
    },
    // Add conditional settings field based on the layout lookup results
    {
      $addFields: {
        settings: {
          $switch: {
            branches: [
              // Case for 'showers' category
              {
                case: { $eq: ["$category", "showers"] },
                then: {
                  $cond: {
                    if: { $gt: [{ $size: "$layoutDetailsShowers" }, 0] }, // If there are shower layouts
                    then: {
                      measurementSides: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.measurementSides",
                          0,
                        ],
                      },
                      image: {
                        $arrayElemAt: ["$layoutDetailsShowers.image", 0],
                      },
                      name: { $arrayElemAt: ["$layoutDetailsShowers.name", 0] },
                      _id: { $arrayElemAt: ["$layoutDetailsShowers._id", 0] },
                      variant: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.variant",
                          0,
                        ],
                      },
                      heavyDutyOption: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.heavyDutyOption",
                          0,
                        ],
                      },
                      hinges: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.hinges",
                          0,
                        ],
                      },
                      handles: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.handles",
                          0,
                        ],
                      },
                      glassType: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.glassType",
                          0,
                        ],
                      }, // Setting glassType from layout
                    },
                    else: null, // If no matching layout, set to null
                  },
                },
              },
              // Case for 'wineCellars' category
              {
                case: { $eq: ["$category", "wineCellars"] },
                then: {
                  $cond: {
                    if: { $gt: [{ $size: "$layoutDetailsWineCellars" }, 0] }, // If there are wine cellar layouts
                    then: {
                      measurementSides: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.measurementSides",
                          0,
                        ],
                      },
                      noOfHoursToCompleteSingleDoor: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.noOfHoursToCompleteSingleDoor",
                          0,
                        ],
                      },
                      image: {
                        $arrayElemAt: ["$layoutDetailsWineCellars.image", 0],
                      },
                      name: {
                        $arrayElemAt: ["$layoutDetailsWineCellars.name", 0],
                      },
                      _id: {
                        $arrayElemAt: ["$layoutDetailsWineCellars._id", 0],
                      },
                      variant: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.variant",
                          0,
                        ],
                      },
                      heavyDutyOption: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.heavyDutyOption",
                          0,
                        ],
                      },
                      hinges: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.hinges",
                          0,
                        ],
                      },
                      handles: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.handles",
                          0,
                        ],
                      },
                      doorLock: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.doorLock",
                          0,
                        ],
                      },
                      glassType: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.glassType",
                          0,
                        ],
                      }, // Setting glassType from layout
                    },
                    else: null, // If no matching layout, set to null
                  },
                },
              },
            ],
            default: null,
          },
        },
      },
    },

    // Conditional lookup for creator details based on creator_type
    {
      $lookup: {
        from: "users",
        localField: "creator_id",
        foreignField: "_id",
        as: "adminDetails",
      },
    },
    {
      $lookup: {
        from: "staffs",
        localField: "creator_id",
        foreignField: "_id",
        as: "staffDetails",
      },
    },
    {
      $lookup: {
        from: "customusers",
        localField: "creator_id",
        foreignField: "_id",
        as: "customadminDetails",
      },
    },
    {
      $addFields: {
        creatorDetails: {
          $switch: {
            branches: [
              {
                case: { $eq: ["$creator_type", "admin"] },
                then: { $arrayElemAt: ["$adminDetails", 0] },
              },
              {
                case: { $eq: ["$creator_type", "staff"] },
                then: { $arrayElemAt: ["$staffDetails", 0] },
              },
              {
                case: { $eq: ["$creator_type", "custom_admin"] },
                then: { $arrayElemAt: ["$customadminDetails", 0] },
              },
            ],
            default: null,
          },
        },
      },
    },
    // Match based on search term if provided
    ...(search && search.trim() !== ""
      ? [
          {
            $match: {
              "customerDetails.name": { $regex: search, $options: "i" },
            },
          },
        ]
      : []),
    // Sort first by createdAt
    {
      $sort: { createdAt: -1 }
    },
    {
      $facet: {
        totalRecords: [{ $count: "count" }],
        estimates: [
          {
            $project: {
              name: 1,
              label: 1,
              category: 1,
              status: 1,
              cost: 1,
              config: 1,
              createdAt: 1,
              updatedAt: 1,
              creatorData: "$creatorDetails",
              customerData: "$customerDetails",
              companyData: "$companyDetails",
              settings: 1,
              project_id: 1,
            },
          },
          { $skip: options.skip },
          { $limit: options.limit },
        ],
      },
    },
    {
      $project: {
        totalRecords: { $arrayElemAt: ["$totalRecords.count", 0] },
        estimates: 1,
      },
    },
  ];
};

exports.fetchSingleRecord = (condition) => {
  return [
    // Match the specific condition
    {
      $match: condition,
    },
    // Lookup to join project details
    {
      $lookup: {
        from: "projects",
        localField: "project_id",
        foreignField: "_id",
        as: "projectDetails",
      },
    },
    {
      $unwind: {
        path: "$projectDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    // Add conditional field for actualCustomerId
    {
      $addFields: {
        actualCustomerId: {
          $cond: {
            if: { $gt: ["$customer_id", null] },
            then: "$customer_id",
            else: "$projectDetails.customer_id",
          },
        },
      },
    },
    // Lookup customer details
    {
      $lookup: {
        from: "customers",
        localField: "actualCustomerId",
        foreignField: "_id",
        as: "customerDetails",
      },
    },
    {
      $unwind: {
        path: "$customerDetails",
        preserveNullAndEmptyArrays: false,
      },
    },
    // Lookup company details
    {
      $lookup: {
        from: "companies",
        localField: "company_id",
        foreignField: "_id",
        as: "companyDetails",
      },
    },
    {
      $unwind: {
        path: "$companyDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    // Lookup for layouts if category is 'showers'
    {
      $lookup: {
        from: "layouts",
        let: { layoutId: "$config.layout_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$_id", { $toObjectId: "$$layoutId" }] }],
              },
            },
          },
        ],
        as: "layoutDetailsShowers",
      },
    },
    // Lookup for wine cellar layouts if category is 'wineCellars'
    {
      $lookup: {
        from: "wine_cellar_layouts",
        let: { layoutId: "$config.layout_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$layoutId" }],
              },
            },
          },
        ],
        as: "layoutDetailsWineCellars",
      },
    },
    // Add conditional settings field based on the layout lookup results
    {
      $addFields: {
        settings: {
          $switch: {
            branches: [
              // Case for 'showers' category
              {
                case: { $eq: ["$category", "showers"] },
                then: {
                  $cond: {
                    if: { $gt: [{ $size: "$layoutDetailsShowers" }, 0] }, // If there are shower layouts
                    then: {
                      measurementSides: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.measurementSides",
                          0,
                        ],
                      },
                      image: {
                        $arrayElemAt: ["$layoutDetailsShowers.image", 0],
                      },
                      name: { $arrayElemAt: ["$layoutDetailsShowers.name", 0] },
                      _id: { $arrayElemAt: ["$layoutDetailsShowers._id", 0] },
                      variant: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.variant",
                          0,
                        ],
                      },
                      heavyDutyOption: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.heavyDutyOption",
                          0,
                        ],
                      },
                      hinges: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.hinges",
                          0,
                        ],
                      },
                      handles: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.handles",
                          0,
                        ],
                      },
                      glassType: {
                        $arrayElemAt: [
                          "$layoutDetailsShowers.settings.glassType",
                          0,
                        ],
                      }, // Setting glassType from layout
                    },
                    else: null, // If no matching layout, set to null
                  },
                },
              },
              // Case for 'wineCellars' category
              {
                case: { $eq: ["$category", "wineCellars"] },
                then: {
                  $cond: {
                    if: { $gt: [{ $size: "$layoutDetailsWineCellars" }, 0] }, // If there are wine cellar layouts
                    then: {
                      measurementSides: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.measurementSides",
                          0,
                        ],
                      },
                      noOfHoursToCompleteSingleDoor: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.noOfHoursToCompleteSingleDoor",
                          0,
                        ],
                      },
                      image: {
                        $arrayElemAt: ["$layoutDetailsWineCellars.image", 0],
                      },
                      name: {
                        $arrayElemAt: ["$layoutDetailsWineCellars.name", 0],
                      },
                      _id: {
                        $arrayElemAt: ["$layoutDetailsWineCellars._id", 0],
                      },
                      variant: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.variant",
                          0,
                        ],
                      },
                      heavyDutyOption: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.heavyDutyOption",
                          0,
                        ],
                      },
                      hinges: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.hinges",
                          0,
                        ],
                      },
                      handles: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.handles",
                          0,
                        ],
                      },
                      doorLock: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.doorLock",
                          0,
                        ],
                      },
                      glassType: {
                        $arrayElemAt: [
                          "$layoutDetailsWineCellars.settings.glassType",
                          0,
                        ],
                      }, // Setting glassType from layout
                    },
                    else: null, // If no matching layout, set to null
                  },
                },
              },
            ],
            default: null,
          },
        },
      },
    },
    // Conditional lookup for creator details
    {
      $lookup: {
        from: "users",
        localField: "creator_id",
        foreignField: "_id",
        as: "adminDetails",
      },
    },
    {
      $lookup: {
        from: "staffs",
        localField: "creator_id",
        foreignField: "_id",
        as: "staffDetails",
      },
    },
    {
      $lookup: {
        from: "customusers",
        localField: "creator_id",
        foreignField: "_id",
        as: "customadminDetails",
      },
    },
    {
      $addFields: {
        creatorDetails: {
          $switch: {
            branches: [
              {
                case: { $eq: ["$creator_type", "admin"] },
                then: { $arrayElemAt: ["$adminDetails", 0] },
              },
              {
                case: { $eq: ["$creator_type", "staff"] },
                then: { $arrayElemAt: ["$staffDetails", 0] },
              },
              {
                case: { $eq: ["$creator_type", "custom_admin"] },
                then: { $arrayElemAt: ["$customadminDetails", 0] },
              },
            ],
            default: null,
          },
        },
      },
    },

    // Unwind to get a single record instead of an array
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            "$$ROOT",
            { creatorDetails: "$creatorDetails" },
            { customerData: "$customerDetails" },
            { companyData: "$companyDetails" },
            { settings: "$settings" },
          ],
        },
      },
    },
    // Finally project the necessary fields
    {
      $project: {
        name: 1,
        label: 1,
        category: 1,
        status: 1,
        cost: 1,
        config: 1,
        createdAt: 1,
        updatedAt: 1,
        creatorData: "$creatorDetails",
        customerData: "$customerDetails",
        companyData: "$companyDetails",
        settings: 1,
        project_id: 1,
      },
    },
  ];
};

exports.fetchGraphData = (condition) => {
  return [
    // Match records within the provided date range
    {
        $match: condition
        // {
        //     createdAt: { 
        //         $gte: new Date(startDate), 
        //         $lte: new Date(endDate) 
        //     }
        // }
    },
    {
        $facet: {
            // Bar chart: group by created date (formatted) and count records
            barChart: [
                {
                    $group: {
                        _id: { 
                            $dateToString: { format: "%Y/%m/%d", date: "$createdAt" } 
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        x: "$_id", // formatted date as 'x'
                        y: "$count" // count as 'y'
                    }
                },
                { $sort: { x: 1 } } // sort by date
            ],
            // Pie chart: group by category and count records
            pieChart: [
                {
                    $group: {
                        _id: "$category", // group by category
                        count: { $sum: 1 } // count number of records per category
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: "$_id", // return category
                        count: "$count" // return count
                    }
                }
            ]
        }
    }
];
}