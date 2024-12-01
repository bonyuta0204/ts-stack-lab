export interface Follow {
  followerId: string;
  followingId: string;
  createdAt: Date;
}

// In-memory storage for follow relationships
export const follows: Follow[] = [];
