exports.userRoles = {
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
  STAFF: "staff",
  CUSTOM_ADMIN: "custom_admin",
};
exports.estimateStatus = {
  PENDING: "pending",
  VOIDED: "voided",
  APPROVED: "approved",
};
exports.layoutVariant = {
  DOOR: "door",
  DOORANDPANEL: "doorandpanel",
  DOUBLEDOOR: "doubledoor",
  DOORANDNIB: "doorandnib",
  DOORANDNOTCHEDPANEL: "doorandnotchedpanel",
  DOORPANELANDRETURN: "doorpanelandreturn",
  DOORNOTCHEDPANELANDRETURN: "doornotchedpanelandreturn",
  SINGLEBARN: "singlebarn",
  DOUBLEBARN: "doublebarn",
  CUSTOM: "custom",
};
exports.multerActions = {
  SAVE: "save",
  PUT: "put",
  DELETE: "delete",
};
exports.multerSource = {
  FINISHES: "finishes",
  STAFFS: "staffs",
  HARDWARES: "hardwares",
  COMPANIES: "companies",
  GLASSADDONS: "glassAddons",
  GLASSTYPES: "glassTypes",
  USERS: "users",
  CUSTOMUSERS: "customUsers",
  ADMINS: "admins",
  CUSTOMERS: "customers",
  MIRROREDGEWORKS: "mirrorEdgeWorks",
  MIRRORGLASSTYPES: "mirrorGlassTypes",
  MIRRORGLASSADDONS: "mirrorGlassAddons",
  MIRRORHARDWARES: "mirrorHardwares",
  WINECELLARHARDWARES: "wineCellarHardwares",
  WINECELLARGLASSTYPES: "wineCellarGlassTypes",
  WINECELLARFINISHES: "wineCellarFinishes",
  WINECELLARGLASSADDONS: "wineCellarGlassAddons",
};

exports.minDoorWidthStandard = 1;

exports.maxDoorWidthStandard = 39;

exports.socketIoChannel = {
  NOTIFICATIONS: "notifications",
};

exports.notificationCategories = {
  ESTIMATES: "estimates",
};

exports.notificationActions = {
  CREATE: "created",
  UPDATE: "updated",
  DELETE: "deleted",
};

exports.estimateCategory = {
  SHOWERS: "showers",
  MIRRORS: "mirrors",
  WINECELLARS: "wineCellars"
};

exports.projectStatus = {
  PENDING: "pending",
  VOIDED: "voided",
  APPROVED: "approved",
}

exports.wineCellarLayoutVariants = {
  INLINE: "inline",
  NINTYDEGREE: "90-degree",
  THREESIDEDGLASS: "3-sided-glass",
  GLASSCUBE: "glass-cube"
}

exports.requiredProps = {
  FORMREQUEST: ["location", "layout", "estimateDetail"],
};

exports.showerGlassThicknessTypes = {
  THREEBYEIGHT: "3/8",
  ONEBYTWO: "1/2",
};

exports.showerWeightMultiplier = {
  THREEBYEIGHT: 4.91,
  ONEBYTWO: 6.5,
};