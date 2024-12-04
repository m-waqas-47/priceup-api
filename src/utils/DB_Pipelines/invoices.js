// exports.fetchAllRecords = (condition, search, options) => {
//   const pipeline = [];

//   // Step 1: Match the initial condition
//   pipeline.push({
//     $match: condition,
//   });

//   // Step 2: Conditionally apply search if it's not an empty string
//   if (search && search.trim() !== "") {
//     pipeline.push({
//       $match: {
//         $or: [
//           { invoiceId: { $regex: search, $options: "i" } }, // Case-insensitive search
//           { "customer.name": { $regex: search, $options: "i" } },
//         ],
//       },
//     });
//   }

//   // Step 3: If skip and limit are provided, calculate the total count and apply pagination
//   if (options && options.skip !== undefined && options.limit !== undefined) {
//     pipeline.push({
//       $facet: {
//         invoices: [{ $skip: options.skip }, { $limit: options.limit }],
//         totalRecords: [{ $count: "count" }],
//       },
//     });

//     pipeline.push({
//       $unwind: {
//         path: "$totalRecords",
//         preserveNullAndEmptyArrays: true,
//       },
//     });

//     pipeline.push({
//       $project: {
//         invoices: 1,
//         totalRecords: { $ifNull: ["$totalRecords.count", 0] },
//       },
//     });
//   } else {
//     // If no pagination, just return the matching documents
//     pipeline.push({
//       $replaceRoot: { newRoot: "$$ROOT" }, // Flatten the array to just the documents
//     });
//   }

//   return pipeline;
// };

exports.fetchAllRecords = (condition, search, options) => {
  const pipeline = [];

  // Step 1: Match the initial condition
  pipeline.push({
    $match: condition,
  });

  // Step 2: Conditionally apply search if it's not an empty string
  if (search && search.trim() !== "") {
    pipeline.push({
      $match: {
        $or: [
          { invoiceId: { $regex: search, $options: "i" } }, // Case-insensitive search
          { "customer.name": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  // Step 3: Sort the records by createdAt in descending order
  pipeline.push({
    $sort: {
      createdAt: -1, // Sort by `createdAt` in descending order
    },
  });

  // Step 4: If skip and limit are provided, calculate the total count and apply pagination
  if (options && options.skip !== undefined && options.limit !== undefined) {
    pipeline.push({
      $facet: {
        invoices: [{ $skip: options.skip }, { $limit: options.limit }],
        totalRecords: [{ $count: "count" }],
      },
    });

    pipeline.push({
      $unwind: {
        path: "$totalRecords",
        preserveNullAndEmptyArrays: true,
      },
    });

    pipeline.push({
      $project: {
        invoices: 1,
        totalRecords: { $ifNull: ["$totalRecords.count", 0] },
      },
    });
  } else {
    // If no pagination, just return the matching documents
    pipeline.push({
      $replaceRoot: { newRoot: "$$ROOT" }, // Flatten the array to just the documents
    });
  }

  return pipeline;
};


exports.fetchStats = (condition = {}) => {
  const pipeline = [
    {
      $match: condition,
    },
    {
      $group: {
        _id: "$status", // Group by the `status` field
        count: { $sum: 1 }, // Count the number of documents in each group
      },
    },
    {
      $project: {
        status: "$_id",
        count: 1,
        _id: 0,
      },
    },
    {
      $group: {
        _id: null, // Combine all results into one document
        statusCounts: {
          $push: {
            k: "$status",
            v: "$count",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        statusCounts: {
          $arrayToObject: "$statusCounts", // Convert the array into an object
        },
      },
    },
  ];
  return pipeline;
};
