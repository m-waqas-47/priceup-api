const { default: mongoose } = require("mongoose");

exports.fetchAllLocationsForSuperAdmin = (search, status) => {
  const statusBoolean =
    status === "true" ? true : status === "false" ? false : null;
  const pipeline = [
    // Conditional match for company search and status
    {
      $match: {
        ...(search &&
          search.trim() !== "" && { name: { $regex: search, $options: "i" } }), // Apply search filter only if search is not empty
      },
    },
    // Lookup user information
    {
      $lookup: {
        from: "users",
        let: { companyUserId: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$companyUserId"] },
            },
          },
        ],
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    // Filter out companies where the associated user's status does not match the condition
    {
      $match: {
        ...(statusBoolean !== null && { "user.status": statusBoolean }), // Match only if user status matches the condition
      },
    },
    // Lookup full staffs information
    {
      $lookup: {
        from: "staffs",
        let: { companyId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ["$company_id", "$$companyId"] },
                  { $in: ["$$companyId", "$haveAccessTo"] },
                ],
              },
            },
          },
        ],
        as: "staffs",
      },
    },
    // Lookup and count related documents
    {
      $lookup: {
        from: "estimates",
        let: { companyId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$company_id", "$$companyId"] },
            },
          },
          {
            $count: "count",
          },
        ],
        as: "estimatesCount",
      },
    },
    {
      $lookup: {
        from: "customers",
        let: { companyId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$company_id", "$$companyId"] },
            },
          },
          {
            $count: "count",
          },
        ],
        as: "customersCount",
      },
    },
    {
      $lookup: {
        from: "layouts",
        let: { companyId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$company_id", "$$companyId"] },
            },
          },
          {
            $count: "count",
          },
        ],
        as: "layoutsCount",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        image: 1,
        address: 1,
        user: 1,
        staffs: 1, // Include full staffs objects
        estimates: { $arrayElemAt: ["$estimatesCount.count", 0] },
        customers: { $arrayElemAt: ["$customersCount.count", 0] },
        layouts: { $arrayElemAt: ["$layoutsCount.count", 0] },
      },
    },
    { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order
  ];
  return pipeline;
};

exports.fetchAllLocationsForCustomAdmin = (condition, search) => {
  const pipeline = [
    // Step 1: Get the custom user by _id and extract locationsAccess
    {
      $match: condition
    },
    {
      $project: {
        locationsAccess: 1,
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "locationsAccess",
        foreignField: "_id",
        as: "companies",
      },
    },
    {
      $unwind: "$companies",
    },
    {
      $replaceRoot: { newRoot: "$companies" },
    },
    // Apply the search filter based on company name
    {
      $match: {
        ...(search &&
          search.trim() !== "" && {
            name: { $regex: search, $options: "i" },
          }),
      },
    },
    // Lookup user information
    {
      $lookup: {
        from: "users",
        let: { companyUserId: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$companyUserId"] },
            },
          },
        ],
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    // Lookup full staffs information
    {
      $lookup: {
        from: "staffs",
        let: { companyId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ["$company_id", "$$companyId"] },
                  { $in: ["$$companyId", "$haveAccessTo"] },
                ],
              },
            },
          },
        ],
        as: "staffs",
      },
    },
    // Lookup and count related documents
    {
      $lookup: {
        from: "estimates",
        let: { companyId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$company_id", "$$companyId"] },
            },
          },
          {
            $count: "count",
          },
        ],
        as: "estimatesCount",
      },
    },
    {
      $lookup: {
        from: "customers",
        let: { companyId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$company_id", "$$companyId"] },
            },
          },
          {
            $count: "count",
          },
        ],
        as: "customersCount",
      },
    },
    {
      $lookup: {
        from: "layouts",
        let: { companyId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$company_id", "$$companyId"] },
            },
          },
          {
            $count: "count",
          },
        ],
        as: "layoutsCount",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        image: 1,
        address: 1,
        user: 1,
        staffs: 1,
        estimates: { $arrayElemAt: ["$estimatesCount.count", 0] },
        customers: { $arrayElemAt: ["$customersCount.count", 0] },
        layouts: { $arrayElemAt: ["$layoutsCount.count", 0] },
      },
    },
    { $sort: { createdAt: -1 } },
  ];
  return pipeline;
};

exports.fetchAllLocationsForStaff = (condition, search) => {
  const pipeline = [
    // Step 1: Get the staff by _id and extract haveAccessTo
    {
      $match: condition
    },
    {
      $project: {
        haveAccessTo: 1,
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "haveAccessTo",
        foreignField: "_id",
        as: "companies",
      },
    },
    {
      $unwind: "$companies",
    },
    {
      $replaceRoot: { newRoot: "$companies" },
    },
    // Apply the search filter based on company name
    {
      $match: {
        ...(search &&
          search.trim() !== "" && {
            name: { $regex: search, $options: "i" },
          }),
      },
    },
    // Lookup user information
    {
      $lookup: {
        from: "users",
        let: { companyUserId: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$companyUserId"] },
            },
          },
        ],
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    // Lookup full staffs information
    {
      $lookup: {
        from: "staffs",
        let: { companyId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ["$company_id", "$$companyId"] },
                  { $in: ["$$companyId", "$haveAccessTo"] },
                ],
              },
            },
          },
        ],
        as: "staffs",
      },
    },
    // Lookup and count related documents
    {
      $lookup: {
        from: "estimates",
        let: { companyId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$company_id", "$$companyId"] },
            },
          },
          {
            $count: "count",
          },
        ],
        as: "estimatesCount",
      },
    },
    {
      $lookup: {
        from: "customers",
        let: { companyId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$company_id", "$$companyId"] },
            },
          },
          {
            $count: "count",
          },
        ],
        as: "customersCount",
      },
    },
    {
      $lookup: {
        from: "layouts",
        let: { companyId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$company_id", "$$companyId"] },
            },
          },
          {
            $count: "count",
          },
        ],
        as: "layoutsCount",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        image: 1,
        address: 1,
        user: 1,
        staffs: 1,
        estimates: { $arrayElemAt: ["$estimatesCount.count", 0] },
        customers: { $arrayElemAt: ["$customersCount.count", 0] },
        layouts: { $arrayElemAt: ["$layoutsCount.count", 0] },
      },
    },
    { $sort: { createdAt: -1 } },
  ];
  return pipeline;
};