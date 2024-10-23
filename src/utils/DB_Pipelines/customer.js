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
                customers: [
                  // { $sort: { createdAt: -1 } },
                  { $skip: options.skip },
                  { $limit: options.limit },
                ],
              },
            },
            {
              $project: {
                totalRecords: { $arrayElemAt: ["$totalRecords.count", 0] },
                customers: 1,
              },
            },
          ]
        : []),
    ];
  
    return pipeline;
  };
  
exports.fetchGraphData = (condition) => {
    return [
      // Match records within the provided date range
      {
          $match: condition
      },
      {
          $facet: {
              // Bar chart: group by created date (formatted) and count records
              lineChart: [
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
              ]
          }
      }
  ];
  }