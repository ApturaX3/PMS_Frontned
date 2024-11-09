// Project Status Enum
export type ProjectStatus = "NOT_STARTED" | "PENDING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";

// Project Priority Enum
export type ProjectPriority = "LOW" | "MEDIUM" | "HIGH";

// User Role Enum
export type UserRole = "LEADER" | "MEMBER" | "ADMIN";

// User Type
export interface User {
    id: number;
    firebaseUid: string;
    email: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    profilePic?: string;
    role: UserRole;
    createdAt: string;  // ISO date string
    updatedAt: string;  // ISO date string
    managedProjects?: ProjectTypes[];  // Projects the user leads
    projects?: ProjectTypes[];         // Projects the user is a member of
}

// Project Type
export interface ProjectTypes {
    id: number;
    title: string;
    comment?: string;
    leaderId?: string;
    leader?: User;
    due_date?: string;            // ISO date string
    priority: string;
    budget?: number;
    files: string[];
    last_update: string;          // ISO date string
    status: string;
    people?: JSON;                 // Define this if the structure is known, else leave as any
    timeline?: JSON;               // Define this if the structure is known, else leave as any
    additional_links: string[];
    Members?: User[];
    createdAt: string;            // ISO date string
}
