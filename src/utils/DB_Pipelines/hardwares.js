exports.fetchAllGroupByCategory = (condition) => {
    return [
  { 
    $match: condition // Match the company_id
  },
  {
    $lookup: {
      from: "hardware_categories", // Assuming the collection for categories
      localField: "hardware_category_slug", // Field in the `hardware` collection
      foreignField: "slug", // Field in the `categories` collection
      as: "category", // Name of the joined field
    },
  },
  {
    $unwind: "$category" // Unwind if you want individual documents per hardware with their category
  },
  {
    $group: {
      _id: "$hardware_category_slug",
      categoryName: { $first: "$category.name" },
      items: { $push: "$$ROOT" }, // Group all items by their category
    },
  },
  {
    $project: {
      _id: 0,
      hardware_category_slug: "$_id",
      categoryName: 1,
      items: 1,
    },
  },
];
}