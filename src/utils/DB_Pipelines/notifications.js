exports.fetchAllRecords = (condition) => {
  const pipeline = [
    // Match notifications for the viewer
    {
      $match: condition,
    },
    // Define the $facet stage to perform two aggregations in parallel
    {
      $facet: {
        notifications: [
          // Lookup to join with companies collection to fetch the company name
          {
            $lookup: {
              from: "companies",
              localField: "company_id",
              foreignField: "_id",
              as: "company",
            },
          },
          // Unwind the company array (if it exists)
          {
            $unwind: {
              path: "$company",
              preserveNullAndEmptyArrays: true, // Allow notifications without a company match
            },
          },
          // Project necessary fields
          {
            $project: {
              _id: 1,
              category: 1,
              description: 1,
              performer_id: 1,
              performer_role: 1,
              performer_name:1,
              action:1,
              resource_id:1,
              viewer:1,
              isRead:1,
              archived:1,
              company_id:1,
              createdAt:1,
              updatedAt:1,
              company_name: "$company.name", // Fetch company name if available
            },
          },
          // Optionally sort by createdAt
          { $sort: { createdAt: -1 } },
        ],
        unReadCount: [
          // Count the unread notifications
          {
            $match: {
              viewer: condition.viewer,
              isRead: false,
            },
          },
          {
            $count: "count", // Count the number of unread notifications
          },
        ],
      },
    },
    // Handle the case where no unread notifications are present
    {
      $project: {
        notifications: 1,
        unReadCount: { $arrayElemAt: ["$unReadCount.count", 0] }, // Extract unread count value
      },
    },
    {
      $addFields: {
        unReadCount: { $ifNull: ["$unReadCount", 0] }, // If no unread notifications, return 0
      },
    },
  ];
  return pipeline;
};
