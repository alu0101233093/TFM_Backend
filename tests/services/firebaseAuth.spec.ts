import { FirebaseAuth } from '../../src/services/FirebaseAuth';
import { CustomError } from '../../src/models/customError';
import { UserFirebaseAuth } from '../../src/models/user/userFirebaseAuth';
import { auth } from "firebase-admin";

const mockAuth = {
  createUser: jest.fn(),
  verifyIdToken: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

jest.mock('../../src/app', () => ({
  firebaseAdminApp: {
    auth: () => mockAuth,
  },
}));

describe('FirebaseAuth', () => {
  let firebaseAuth: FirebaseAuth;

  beforeEach(() => {
    firebaseAuth = new FirebaseAuth();
  });

  test('createUser should return a user record on success', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' } as auth.UserRecord;
    mockAuth.createUser.mockResolvedValue(mockUser);

    const user: UserFirebaseAuth = {
      email: 'test@example.com',
      password: 'password123',
      emailVerified: false,
      displayName: 'Test User',
      photoURL: '',
    };
    const result = await firebaseAuth.createUser(user);
    expect(result).toEqual(mockUser);
  });

  test('createUser should throw a CustomError on failure', async () => {
    const error = new Error('Failed to create user');
    mockAuth.createUser.mockRejectedValue(error);

    const user: UserFirebaseAuth = {
      email: 'invalidemail',
      password: 'password123',
      emailVerified: false,
      displayName: 'Test User',
      photoURL: '',
    };
    await expect(firebaseAuth.createUser(user)).rejects.toThrow(CustomError);
  });

  test('verifyIdToken should return a decoded token on success', async () => {
    const mockToken = { uid: '123' } as auth.DecodedIdToken;
    mockAuth.verifyIdToken.mockResolvedValue(mockToken);

    const idToken = 'valid.id.token';
    const result = await firebaseAuth.verifyIdToken(idToken);
    expect(result).toEqual(mockToken);
  });

  test('verifyIdToken should throw a CustomError on failure', async () => {
    const error = new Error('Failed to verify token');
    mockAuth.verifyIdToken.mockRejectedValue(error);

    const idToken = 'invalid.id.token';
    await expect(firebaseAuth.verifyIdToken(idToken)).rejects.toThrow(CustomError);
  });

  test('updateUser should update a user on success', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' } as auth.UserRecord;
    mockAuth.updateUser.mockResolvedValue(mockUser);

    const user: UserFirebaseAuth = {
      email: 'test@example.com',
      password: 'password123',
      emailVerified: false,
      displayName: 'Test User',
      photoURL: '',
    };
    const result = await firebaseAuth.updateUser('123', user);
    expect(result).toEqual(mockUser);
  });

  test('updateUser should throw a CustomError on failure', async () => {
    const error = new Error('Failed to update user');
    mockAuth.updateUser.mockRejectedValue(error);

    const user: UserFirebaseAuth = {
      email: 'test@example.com',
      password: 'password123',
      emailVerified: false,
      displayName: 'Test User',
      photoURL: '',
    };
    await expect(firebaseAuth.updateUser('123', user)).rejects.toThrow(CustomError);
  });

  test('changeUserRole should update the user role on success', async () => {
    mockAuth.updateUser.mockResolvedValue({ uid: '123', emailVerified: true });

    const result = await firebaseAuth.changeUserRole('123', true);
    expect(result).toBe('User role updated successfully.');
  });

  test('changeUserRole should throw a CustomError on failure', async () => {
    const error = new Error('Failed to change user role');
    mockAuth.updateUser.mockRejectedValue(error);

    await expect(firebaseAuth.changeUserRole('123', true)).rejects.toThrow(CustomError);
  });

  test('deleteUser should delete a user on success', async () => {
    mockAuth.deleteUser.mockResolvedValue(undefined);

    const result = await firebaseAuth.deleteUser('123');
    expect(result).toBeUndefined();
  });

  test('deleteUser should throw a CustomError on failure', async () => {
    const error = new Error('Failed to delete user');
    mockAuth.deleteUser.mockRejectedValue(error);

    await expect(firebaseAuth.deleteUser('123')).rejects.toThrow(CustomError);
  });
});
