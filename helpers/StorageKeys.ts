export const StorageKeys = {
  // Auth
  ACCESS_TOKEN: "@bboxly:access_token",
  REFRESH_TOKEN: "@bboxly:refresh_token",
  USER_DATA: "@bboxly:user_data",

  // App settings
  LANGUAGE: "@bboxly:language",
  THEME: "@bboxly:theme",

  // Team
  CURRENT_TEAM_ID: "@bboxly:current_team_id",

  // Project
  CURRENT_PROJECT_ID: "@bboxly:current_project_id",

  // Cache
  TEAMS_CACHE: "@bboxly:teams_cache",
  PROJECTS_CACHE: "@bboxly:projects_cache",

  // Labels
  RECENT_LABELS: "@bboxly:recent_labels",
} as const;
