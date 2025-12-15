export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
  SEATING_MANAGER: 'seating_manager',
  CLUB_COORDINATOR: 'club_coordinator'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  USERS: '/users',
  SYLLABUS: '/syllabus',
  EXAMS: '/exams',
  HALL_TICKETS: '/halltickets',
  SEATING: '/seating',
  EVENTS: '/events',
  AI: {
    MINDMAP: '/ai/generate-mindmap',
    SUGGESTIONS: '/ai/get-suggestions'
  }
};

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  THEME: 'theme_preference'
};