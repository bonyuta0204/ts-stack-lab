export interface Tweet {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
}

// In-memory storage for tweets
export const tweets: Tweet[] = [];
