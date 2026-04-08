'use server';

import { AuthService } from '@/lib/services/auth.service';
import { validateUserCreate } from '@/lib/validation/schemas';

export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  number: string;
  country: string;
  countryCode: string;
  role: 'user' | 'admin' | 'employee';
  accessKey?: string;
}) {
  try {
    // Server-side validation
    const validatedData = validateUserCreate(userData);
    
    // Business logic
    const user = await AuthService.registerUser(validatedData);
    
    return { success: true, user };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to register user' 
    };
  }
}
