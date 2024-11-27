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

  // Step 3: If skip and limit are provided, calculate the total count and apply pagination
  if (options && options.skip !== undefined && options.limit !== undefined) {
    pipeline.push({
      $facet: {
        data: [{ $skip: options.skip }, { $limit: options.limit }],
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
