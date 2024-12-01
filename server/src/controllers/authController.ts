import { type Request, type Response } from 'express';
import { userService } from '../services/userService';
import { getFirebaseAuth } from '../config/firebase';

export class AuthController {
  async handleFirebaseAuth(req: Request, res: Response) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({ error: 'ID token is required' });
      }

      // Verify the Firebase ID token
      const decodedToken = await getFirebaseAuth().verifyIdToken(idToken);
      
      // Find or create user in our database
      const user = await userService.findOrCreateFirebaseUser(
        decodedToken.uid,
        decodedToken.email || '',
        decodedToken.name || decodedToken.email?.split('@')[0] || 'Anonymous User'
      );

      return res.status(200).json({ user });
    } catch (error) {
      console.error('Firebase authentication error:', error);
      return res.status(401).json({ error: 'Authentication failed' });
    }
  }
}

export const authController = new AuthController();
