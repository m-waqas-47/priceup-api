exports.fetchAllLocationsForSuperAdmin = (search, status) => {
  console.log("status", status);
  const statusBoolean =
    status === "true" ? true : status === "false" ? false : null;
  const pipeline = [
    // Conditional match for company search and status
    {
      $match: {
        ...(search && search.trim() !== "" && { name: { $regex: search, $options: "i" } }), // Apply search filter only if search is not empty
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
