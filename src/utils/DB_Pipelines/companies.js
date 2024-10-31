exports.fetchAllLocationsForSuperAdmin = (search, status) => {
  const statusBoolean =
    status === "true" ? true : status === "false" ? false : null;

    const pipeline = [
      // Global counts calculation step
      {
        $facet: {
          globalCounts: [
            {
              $lookup: {
                from: "users",
                pipeline: [
                  {
                    $group: {
                      _id: null,
                      activeLocations: {
                        $sum: {
                          $cond: [{ $eq: ["$status", true] }, 1, 0],
                        },
                      },
                      inactiveLocations: {
                        $sum: {
                          $cond: [{ $eq: ["$status", false] }, 1, 0],
                        },
                      },
                    },
                  },
                ],
                as: "locationCounts",
              },
            },
            {
              $unwind: {
                path: "$locationCounts",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                activeLocations: "$locationCounts.activeLocations",
                inactiveLocations: "$locationCounts.inactiveLocations",
              },
            },
          ],
          filteredCompanies: [
            {
              $match: {
                ...(search && {
                  name: { $regex: search, $options: "i" },
                }),
              },
            },
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
            // Separate $match for the status filter
            {
              $match: {
                ...(statusBoolean !== null && {
                  "user.status": statusBoolean,
                }),
              },
            },
            // Additional stages like $lookup for other related data
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
                createdAt: 1, // Ensure createdAt is included for sorting
                user: 1,
                staffs: 1,
                estimates: { $arrayElemAt: ["$estimatesCount.count", 0] },
                customers: { $arrayElemAt: ["$customersCount.count", 0] },
                layouts: { $arrayElemAt: ["$layoutsCount.count", 0] },
              },
            },
            { $sort: { createdAt: -1 } }, // Sorting stage
          ],
        },
      },
      {
        $project: {
          companies: "$filteredCompanies",
          globalCounts: { $arrayElemAt: ["$globalCounts", 0] },
        },
      },
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

exports.fetchTopPerfromingCompaniesWithActiveInactiveCount = (condition) => {
  const pipeline = [
    // Step 1: Lookup user details and determine company activity status
    {
        $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userDetails"
        }
    },
    {
        $addFields: {
            isActive: {
                $gt: [
                    {
                        $size: {
                            $filter: {
                                input: "$userDetails",
                                as: "user",
                                cond: { $eq: ["$$user.status", true] }
                            }
                        }
                    },
                    0
                ]
            }
        }
    },

    // Step 2: Group companies, count active/inactive, and push companies into an array
    {
        $group: {
            _id: null,
            activeCompanyCount: { $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] } },
            inactiveCompanyCount: { $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] } },
            companies: { $push: "$$ROOT" }
        }
    },

    // Step 3: Unwind companies to prepare for lookup
    {
        $unwind: "$companies"
    },

    // Step 4: Lookup estimates for each company
    {
        $lookup: {
            from: "estimates",
            localField: "companies._id",
            foreignField: "company_id",
            as: "estimateDetails"
        }
    },
    {
        $addFields: {
            "companies.estimateCount": { $size: "$estimateDetails" }
        }
    },

    // Step 5: Lookup customers for each company
    {
        $lookup: {
            from: "customers",
            localField: "companies._id",
            foreignField: "company_id",
            as: "customerDetails"
        }
    },
    {
        $addFields: {
            "companies.customerCount": { $size: "$customerDetails" }
        }
    },

    // Step 6: Group again to maintain unique companies after lookups
    {
        $group: {
            _id: null,
            activeCompanyCount: { $first: "$activeCompanyCount" },
            inactiveCompanyCount: { $first: "$inactiveCompanyCount" },
            companies: { $push: "$companies" }
        }
    },

    // Step 7: Sort companies by estimateCount and limit to top 5
    {
        $addFields: {
            topCompanies: {
                $slice: [
                    {
                        $sortArray: {
                            input: "$companies",
                            sortBy: { "estimateCount": -1 }
                        }
                    },
                    5
                ]
            }
        }
    },

    // Step 8: Project final structure
    {
        $project: {
            _id: 0,
            activeCompanyCount: 1,
            inactiveCompanyCount: 1,
            topCompanies: {
                $map: {
                    input: "$topCompanies",
                    as: "company",
                    in: {
                        name: "$$company.name",
                        image: "$$company.image",
                        estimateCount: "$$company.estimateCount",
                        customerCount: "$$company.customerCount"
                    }
                }
            }
        }
    }
];
return pipeline;
}