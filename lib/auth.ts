import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function generateTempPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export function generateReceiptNumber(): string {
  const today = new Date();
  const yyyymmdd = today.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `VT-${yyyymmdd}-${random}`;
}

export function generatePlotNumber(lastNumber: number): string {
  return `VT-${String(lastNumber + 1).padStart(3, '0')}`;
}

// Keep existing helpers if they are still useful, or replace them
// Based on the prompt, it seems we should focus on these new ones.
// I'll keep apiResponse and apiError from the old version for consistency in routes.

export function apiResponse(data: any, status: number = 200, message: string = 'Success') {
  return Response.json(
    { success: true, message, data },
    { status }
  );
}

export function apiError(message: string, status: number = 400, errors: any = null) {
  return Response.json(
    { success: false, message, errors },
    { status }
  );
}

export async function getUserFromRequest(req: any): Promise<any> {
  try {
    // Try to get token from Authorization header first
    let token = null;
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else {
      // Try to get token from cookies
      const cookies = req.headers.get('cookie');
      if (cookies) {
        const tokenMatch = cookies.match(/token=([^;]+)/);
        if (tokenMatch) {
          token = tokenMatch[1];
        }
      }
    }

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    return decoded;
  } catch (error) {
    return null;
  }
}
