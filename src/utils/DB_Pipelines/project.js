exports.fetchAllRecords = (condition, search, options) => {
  const pipeline = [
    // Match the specific condition
    {
      $match: condition,
    },
    // Lookup to join customer details
    {
      $lookup: {
        from: "customers",
        localField: "customer_id",
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

    // Lookup to join address details
    {
      $lookup: {
        from: "addresses",
        localField: "address_id",
        foreignField: "_id",
        as: "addressDetails",
      },
    },
    {
      $unwind: {
        path: "$addressDetails",
        preserveNullAndEmptyArrays: true,
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
  ];
  if (search && search.trim() !== "") {
    pipeline.push({
      $match: {
        $or: [
          { "customerDetails.name": { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
          { "addressDetails.name": { $regex: search, $options: "i" } },
          // { location: { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  // Check if pagination is needed
  if (options && options.skip !== undefined && options.limit !== undefined) {
    pipeline.push(
      {
        $facet: {
          totalRecords: [{ $count: "count" }],
          projects: [
            {
              $project: {
                name: 1,
                notes: 1,
                totalAmountQuoted: 1,
                location: 1,
                address: 1,
                creatorData: "$creatorDetails",
                creator_type: 1,
                customerData: "$customerDetails",
                addressData: "$addressDetails",
                companyData: "$companyDetails",
                status: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
            { $skip: options?.skip },
            { $limit: options?.limit },
            { $sort: { createdAt: -1 } },
          ],
        },
      },
      {
        $project: {
          totalRecords: { $arrayElemAt: ["$totalRecords.count", 0] },
          projects: 1,
        },
      }
    );
  } else {
    pipeline.push(
      {
        $project: {
          name: 1,
          notes: 1,
          totalAmountQuoted: 1,
          location: 1,
          address: 1,
          creatorData: "$creatorDetails",
          creator_type: 1,
          customerData: "$customerDetails",
          addressData: "$addressDetails",
          companyData: "$companyDetails",
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: { createdAt: -1 } }
    );
  }
  return pipeline;
};

exports.fetchSingleRecord = (condition) => {
  const pipeline = [
    // Match the specific condition
    {
      $match: condition,
    },
    // Lookup to join customer details
    {
      $lookup: {
        from: "customers",
        localField: "customer_id",
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

    // Lookup to join address details
    {
      $lookup: {
        from: "addresses",
        localField: "address_id",
        foreignField: "_id",
        as: "addressDetails",
      },
    },
    {
      $unwind: {
        path: "$addressDetails",
        preserveNullAndEmptyArrays: true,
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
  ];

  pipeline.push(
    {
      $project: {
        name: 1,
        notes: 1,
        totalAmountQuoted: 1,
        location: 1,
        address: 1,
        creatorData: "$creatorDetails",
        creator_type: 1,
        customerData: "$customerDetails",
        addressData: "$addressDetails",
        companyData: "$companyDetails",
        status: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    { $sort: { createdAt: -1 } }
  );
  return pipeline;
};
