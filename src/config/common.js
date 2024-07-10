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
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
};
