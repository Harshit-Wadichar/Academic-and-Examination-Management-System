const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
  SEATING_MANAGER: 'seating_manager',
  CLUB_COORDINATOR: 'club_coordinator'
};

const EXAM_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed'
};

const EVENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
};

const SEATING_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  LOCKED: 'locked'
};

module.exports = {
  USER_ROLES,
  EXAM_STATUS,
  EVENT_STATUS,
  SEATING_STATUS
};