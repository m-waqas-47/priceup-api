exports.fetchAllRecords = (condition, search, options) => {
  const pipeline = [
    // Match the specific condition
    {
      $match: condition,
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
    {
      $sort: { createdAt: -1 }
    },
    // Conditional aggregation based on the presence of pagination options
    ...(options && options.skip !== undefined && options.limit !== undefined
      ? [
          {
            $facet: {
              totalRecords: [{ $count: "count" }],
              staffs: [
                // { $sort: { createdAt: -1 } },
                { $skip: options.skip },
                { $limit: options.limit },
              ],
            },
          },
          {
            $project: {
              totalRecords: { $arrayElemAt: ["$totalRecords.count", 0] },
              staffs: 1,
            },
          },
        ]
      : []
      // [{ $sort: { createdAt: -1 } }]
    ),
  ];

  return pipeline;
};
