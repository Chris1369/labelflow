export const StorageKeys = {
  // Auth
  ACCESS_TOKEN: '@labeltool:access_token',
  REFRESH_TOKEN: '@labeltool:refresh_token',
  USER_DATA: '@labeltool:user_data',
  
  // App settings
  LANGUAGE: '@labeltool:language',
  THEME: '@labeltool:theme',
  
  // Team
  CURRENT_TEAM_ID: '@labeltool:current_team_id',
  
  // Project
  CURRENT_PROJECT_ID: '@labeltool:current_project_id',
  
  // Cache
  TEAMS_CACHE: '@labeltool:teams_cache',
  PROJECTS_CACHE: '@labeltool:projects_cache',
} as const;