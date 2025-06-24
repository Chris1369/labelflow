export interface Team {
  id: string;
  _id?: string; // MongoDB ID
  name: string;
  description: string;
  projectId: string[]; // Array of Project IDs
  members: string[]; // Array of User IDs
  owner: string; // User ID
  createdAt: string;
  updatedAt: string;
  __v?: number; // MongoDB version key
}

export interface CreateTeamRequest {
  name: string;
  description: string;
  projectId?: string[]; // Optional car peut être vide au début
  members?: string[]; // Optional car peut être vide au début
  owner?: string; // Optional car on peut le récupérer du user connecté
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  projectId?: string[];
  members?: string[];
}

export interface AddMemberRequest {
  email: string;
}

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role?: string;
  joinedAt?: string;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
}