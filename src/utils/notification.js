const { notificationCategories, userRoles } = require("@config/common");
const AdminService = require("@services/admin");
const CompanyService = require("@services/company");
const CustomUserService = require("@services/customUser");
const NotificationService = require("@services/notification");

exports.generateNotifications = async (
  category,
  action,
  performer,
  resourceId
) => {
  try {
    const notificationPromises = [];

    switch (category) {
      case notificationCategories.ESTIMATES:
        if (
          [userRoles.ADMIN, userRoles.CUSTOM_ADMIN].includes(performer.role)
        ) {
          const allSuperAdmins = await AdminService.findAll();
          allSuperAdmins?.forEach((superAdmin) => {
            notificationPromises.push(
              NotificationService.create({
                category,
                description: `Estimate ${action} successfully`,
                performer_id: performer.id,
                performer_role: performer.role,
                action,
                resource_id: resourceId,
                viewer: superAdmin._id,
                company_id: performer.company_id,
              })
            );
          });
        } else if (performer.role === userRoles.STAFF) {
          const company = await CompanyService.findBy({
            _id: performer.company_id,
          });
          if (company) {
            notificationPromises.push(
              NotificationService.create({
                category,
                description: `Estimate ${action} successfully`,
                performer_id: performer.id,
                performer_role: performer.role,
                action,
                resource_id: resourceId,
                viewer: company.user_id,
                company_id: performer.company_id,
              })
            );

            const customAdmins = await CustomUserService.findAll({
              locationsAccess: { $in: [company._id] },
            });
            customAdmins?.forEach((customAdmin) => {
              notificationPromises.push(
                NotificationService.create({
                  category,
                  description: `Estimate ${action} successfully`,
                  performer_id: performer.id,
                  performer_role: performer.role,
                  action,
                  resource_id: resourceId,
                  viewer: customAdmin._id,
                  company_id: performer.company_id,
                })
              );
            });

            const allSuperAdmins = await AdminService.findAll();
            allSuperAdmins?.forEach((superAdmin) => {
              notificationPromises.push(
                NotificationService.create({
                  category,
                  description: `Estimate ${action} successfully`,
                  performer_id: performer.id,
                  performer_role: performer.role,
                  action,
                  resource_id: resourceId,
                  viewer: superAdmin._id,
                  company_id: performer.company_id,
                })
              );
            });
          }
        }
        break;
      default:
        break;
    }

    // Wait for all notifications to be created
    await Promise.all(notificationPromises);
  } catch (error) {
    throw error;
  }
};
