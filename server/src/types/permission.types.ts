export enum Permission {
    // Admin permissions
    MANAGE_USERS = 'manage_users',
    MANAGE_ROLES = 'manage_roles',
    MANAGE_SCHEDULES = 'manage_schedules',
    MANAGE_ROUNDS = 'manage_rounds',
    VIEW_ALL_SCORES = 'view_all_scores',
    MANAGE_STARTUPS = 'manage_startups',
    MANAGE_JUDGES = 'manage_judges',
    
    // Judge permissions
    VIEW_SCHEDULE = 'view_schedule',
    SUBMIT_SCORES = 'submit_scores',
    VIEW_OWN_SCHEDULE = 'view_own_schedule',
    UPDATE_PROFILE = 'update_profile',
    MANAGE_EVALUATIONS = 'manage_evaluations',
    
    // Common permissions
    VIEW_PROFILE = 'view_profile',
  }
  
  export const RolePermissions = {
    admin: [
      Permission.MANAGE_USERS,
      Permission.MANAGE_ROLES,
      Permission.MANAGE_SCHEDULES,
      Permission.MANAGE_ROUNDS,
      Permission.VIEW_ALL_SCORES,
      Permission.VIEW_PROFILE,
      Permission.UPDATE_PROFILE,
      Permission.MANAGE_STARTUPS,
      Permission.MANAGE_JUDGES,
      Permission.MANAGE_EVALUATIONS,
    ],
    judge: [
      Permission.VIEW_SCHEDULE,
      Permission.SUBMIT_SCORES,
      Permission.VIEW_OWN_SCHEDULE,
      Permission.VIEW_PROFILE,
      Permission.UPDATE_PROFILE,
      Permission.MANAGE_EVALUATIONS,
    ],
  };