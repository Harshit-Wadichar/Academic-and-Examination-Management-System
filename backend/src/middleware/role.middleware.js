const { USER_ROLES } = require("../config/constants");

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please authenticate.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

// Specific role middlewares
const adminOnly = roleMiddleware([USER_ROLES.ADMIN]);
const studentOnly = roleMiddleware([USER_ROLES.STUDENT]);
const seatingManagerOnly = roleMiddleware([USER_ROLES.SEATING_MANAGER]);
const clubCoordinatorOnly = roleMiddleware([USER_ROLES.CLUB_COORDINATOR]);
const teacherOnly = roleMiddleware([USER_ROLES.TEACHER]);

// Combined role middlewares
const adminOrSeatingManager = roleMiddleware([
  USER_ROLES.ADMIN,
  USER_ROLES.SEATING_MANAGER,
]);
const adminOrClubCoordinator = roleMiddleware([
  USER_ROLES.ADMIN,
  USER_ROLES.CLUB_COORDINATOR,
]);

module.exports = {
  roleMiddleware,
  adminOnly,
  studentOnly,
  seatingManagerOnly,
  clubCoordinatorOnly,
  teacherOnly,
  adminOrSeatingManager,
  adminOrClubCoordinator,
};
