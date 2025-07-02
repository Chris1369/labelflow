export const StorageKeys = {
  // Auth
  ACCESS_TOKEN: "@labelflow:access_token",
  REFRESH_TOKEN: "@labelflow:refresh_token",
  USER_DATA: "@labelflow:user_data",

  // App settings
  LANGUAGE: "@labelflow:language",
  THEME: "@labelflow:theme",

  // Team
  CURRENT_TEAM_ID: "@labelflow:current_team_id",

  // Project
  CURRENT_PROJECT_ID: "@labelflow:current_project_id",

  // Cache
  TEAMS_CACHE: "@labelflow:teams_cache",
  PROJECTS_CACHE: "@labelflow:projects_cache",

  // Labels
  RECENT_LABELS: "@labelflow:recent_labels",
} as const;
