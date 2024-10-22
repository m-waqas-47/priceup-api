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