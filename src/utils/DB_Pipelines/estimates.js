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
            if: { $gt: ["$customer_id", null] }, // Check if customer_id exists
            then: "$customer_id",
            else: "$projectDetails.customer_id",
          },
        },
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

    // Lookup to join layout details
    {
      $lookup: {
        from: "layouts",
        let: { layoutId: "$config.layout_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$_id", { $toObjectId: "$$layoutId" }] } },
          },
        ],
        as: "layoutDetails",
      },
    },
    {
      $addFields: {
        settings: {
          $cond: {
            if: { $gt: [{ $size: "$layoutDetails" }, 0] },
            then: {
              measurementSides: {
                $arrayElemAt: ["$layoutDetails.settings.measurementSides", 0],
              },
              image: { $arrayElemAt: ["$layoutDetails.image", 0] },
              name: { $arrayElemAt: ["$layoutDetails.name", 0] },
              _id: { $arrayElemAt: ["$layoutDetails._id", 0] },
              variant: { $arrayElemAt: ["$layoutDetails.settings.variant", 0] },
              heavyDutyOption: {
                $arrayElemAt: ["$layoutDetails.settings.heavyDutyOption", 0],
              },
              hinges: { $arrayElemAt: ["$layoutDetails.settings.hinges", 0] },
              glassType: "$config.glassType",
            },
            else: null,
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
          { $sort: { createdAt: -1 } },
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