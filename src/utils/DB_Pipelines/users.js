exports.fetchAllRecords = (condition, search, options) => {
  const pipeline = [
    {
      $facet: {
        // Count all records in the 'admins' collection without condition
        adminCount: [
          { $match: {} }, // Match all records in the admins collection
          { $count: "count" },
        ],
        // Count all records in the 'staffs' collection without condition
        staffCount: [
          {
            $unionWith: {
              coll: "staffs",
              pipeline: [
                { $match: {} }, // Match all records in the staffs collection
                { $count: "count" },
              ],
            },
          },
        ],
        // Count all records in the 'customusers' collection without condition
        customUserCount: [
          {
            $unionWith: {
              coll: "customusers",
              pipeline: [
                { $match: {} }, // Match all records in the customusers collection
                { $count: "count" },
              ],
            },
          },
        ],
        // Fetch filtered and paginated users
        users: [
          { $match: condition },
          {
            $unionWith: {
              coll: "staffs",
              pipeline: [
                { $match: condition },
                {
                  $project: {
                    name: 1,
                    email: 1,
                    image: 1,
                    role: 1,
                    status: 1,
                    haveAccessTo: 1,
                    company_id: 1,
                    createdAt: 1,
                  },
                },
              ],
            },
          },
          {
            $unionWith: {
              coll: "customusers",
              pipeline: [
                { $match: condition },
                {
                  $project: {
                    name: 1,
                    email: 1,
                    image: 1,
                    role: 1,
                    status: 1,
                    locationsAccess: 1,
                    createdAt: 1,
                  },
                },
              ],
            },
          },
          // Apply search filter if provided
          ...(search && search.trim() !== ""
            ? [
                {
                  $match: {
                    name: { $regex: search, $options: "i" },
                  },
                },
              ]
            : []),
          { $sort: { createdAt: -1 } },
          { $skip: options.skip },
          { $limit: options.limit },
        ],
        // Count filtered records to get totalRecords
        filteredCount: [
          { $match: condition },
          {
            $unionWith: {
              coll: "staffs",
              pipeline: [{ $match: condition }],
            },
          },
          {
            $unionWith: {
              coll: "customusers",
              pipeline: [{ $match: condition }],
            },
          },
          ...(search && search.trim() !== ""
            ? [
                {
                  $match: {
                    name: { $regex: search, $options: "i" },
                  },
                },
              ]
            : []),
          { $count: "count" },
        ],
      },
    },
    {
      $project: {
        totalRecords: { $arrayElemAt: ["$filteredCount.count", 0] },
        adminCount: { $arrayElemAt: ["$adminCount.count", 0] },
        staffCount: { $arrayElemAt: ["$staffCount.count", 0] },
        customUserCount: { $arrayElemAt: ["$customUserCount.count", 0] },
        totalUserCount: {
          $sum: [
            { $arrayElemAt: ["$adminCount.count", 0] },
            { $arrayElemAt: ["$staffCount.count", 0] },
            { $arrayElemAt: ["$customUserCount.count", 0] },
          ],
        },
        users: 1,
      },
    },
  ];

  return pipeline;
};
