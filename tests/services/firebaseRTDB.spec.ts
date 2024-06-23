import { FirebaseRTDB } from '../../src/services/FirebaseRTDB';
import { CustomError } from '../../src/models/customError';
import { Review } from '../../src/models/review/review';
import { VerificationRequest } from '../../src/models/verificationRequest';


// Mock de los métodos de Firebase Admin
const mockPush = jest.fn();
const mockGet = jest.fn();
const mockOnce = jest.fn();
const mockRemove = jest.fn();
const mockUpdate = jest.fn();

const mockRef = jest.fn(() => ({
  push: mockPush,
  get: mockGet,
  once: mockOnce,
  remove: mockRemove,
  update: mockUpdate
}));

const mockDatabase = {
  ref: mockRef
};

jest.mock('../../src/app', () => ({
  firebaseAdminApp: {
    database: () => mockDatabase,
  },
}));

describe('FirebaseRTDB', () => {
  let firebaseRTDB: FirebaseRTDB;

  beforeEach(() => {
    firebaseRTDB = new FirebaseRTDB();
  });

  test('setReview should return a review key on success', async () => {
    const mockSnapshot = { key: 'review_key' };
    mockPush.mockResolvedValue(mockSnapshot);

    const review: Review = {
      movieId: 1,
      uid: 'user123',
      username: 'user1',
      photoURL: 'http://example.com/photo.jpg',
      score: 5,
      text: 'Great movie!'
    };
    const result = await firebaseRTDB.setReview(review, 'movie123', false);
    expect(result).toBe('review_key');
  });

  test('setReview should throw a CustomError on failure', async () => {
    mockPush.mockRejectedValue(new Error('Push failed'));

    const review: Review = {
      movieId: 1,
      uid: 'user123',
      username: 'user1',
      photoURL: 'http://example.com/photo.jpg',
      score: 5,
      text: 'Great movie!'
    };
    await expect(firebaseRTDB.setReview(review, 'movie123', false)).rejects.toThrow(CustomError);
  });

  test('getReviews should return all reviews for a movie', async () => {
    const spectatorsReviews = {
      review1: { movieId: 1, uid: 'user1', username: 'user1', photoURL: 'http://example.com/photo.jpg', score: 4, text: 'Good movie' },
      review2: { movieId: 1, uid: 'user2', username: 'user2', photoURL: 'http://example.com/photo.jpg', score: 3, text: 'Not bad' }
    };
    const criticsReviews = {
      review3: { movieId: 1, uid: 'critic1', username: 'critic1', photoURL: 'http://example.com/photo.jpg', score: 5, text: 'Excellent' },
      review4: { movieId: 1, uid: 'critic2', username: 'critic2', photoURL: 'http://example.com/photo.jpg', score: 5, text: 'Superb' }
    };
    mockGet
      .mockResolvedValueOnce({ exists: () => true, val: () => spectatorsReviews })
      .mockResolvedValueOnce({ exists: () => true, val: () => criticsReviews });

    const result = await firebaseRTDB.getReviews('movie123');
    expect(result).toEqual({
      spectators: spectatorsReviews,
      critics: criticsReviews
    });
  });

  test('getReviews should throw a CustomError if spectators reviews fetch fails', async () => {
    mockGet.mockRejectedValueOnce(new Error('Fetch failed'));

    await expect(firebaseRTDB.getReviews('movie123')).rejects.toThrow(CustomError);
  });

  test('removeReview should delete a review', async () => {
    mockRemove.mockResolvedValue(undefined);

    await expect(firebaseRTDB.removeReview('movie123', 'review123', false)).resolves.toBeUndefined();
  });

  test('removeReview should throw a CustomError on failure', async () => {
    mockRemove.mockRejectedValue(new Error('Remove failed'));

    await expect(firebaseRTDB.removeReview('movie123', 'review123', false)).rejects.toThrow(CustomError);
  });

  test('deleteUserReviews should delete user reviews from both critic and spectator categories', async () => {
    const deleteReviewsSpy = jest.spyOn(firebaseRTDB as any, 'deleteReviews').mockResolvedValue(undefined);

    await expect(firebaseRTDB.deleteUserReviews('user123')).resolves.toBeUndefined();
    expect(deleteReviewsSpy).toHaveBeenCalledTimes(2);
    expect(deleteReviewsSpy).toHaveBeenCalledWith('criticReviews', 'user123');
    expect(deleteReviewsSpy).toHaveBeenCalledWith('reviews', 'user123');
  });

  test('getVerificationRequests should return all verification requests', async () => {
    const requests = {
      request1: { uid: 'user1', status: 'Pending', user: { email: 'user1@example.com', emailVerified: true, photoURL: 'http://example.com/photo.jpg' }, text: 'Request 1' },
      request2: { uid: 'user2', status: 'Approved', user: { email: 'user2@example.com', emailVerified: true, photoURL: 'http://example.com/photo.jpg' }, text: 'Request 2' }
    };
    mockGet.mockResolvedValue({ exists: () => true, val: () => requests });

    const result = await firebaseRTDB.getVerificationRequests();
    expect(result).toEqual([
      { requestID: 'request1', uid: 'user1', status: 'Pending', user: { email: 'user1@example.com', emailVerified: true, photoURL: 'http://example.com/photo.jpg' }, text: 'Request 1' },
      { requestID: 'request2', uid: 'user2', status: 'Approved', user: { email: 'user2@example.com', emailVerified: true, photoURL: 'http://example.com/photo.jpg' }, text: 'Request 2' }
    ]);
  });

  test('getVerificationRequests should throw a CustomError if no requests are found', async () => {
    mockGet.mockResolvedValue({ exists: () => false });

    await expect(firebaseRTDB.getVerificationRequests()).rejects.toThrow(CustomError);
  });

  test('setVerificationRequest should return a request key on success', async () => {
    const mockSnapshot = { key: 'request_key' };
    mockPush.mockResolvedValue(mockSnapshot);

    const request: VerificationRequest = {
      uid: 'user123',
      status: 'Pending',
      user: { email: 'user@example.com', emailVerified: true, photoURL: 'http://example.com/photo.jpg' },
      text: 'Request text'
    };
    const result = await firebaseRTDB.setVerificationRequest(request);
    expect(result).toBe('request_key');
  });

  test('setVerificationRequest should throw a CustomError on failure', async () => {
    mockPush.mockRejectedValue(new Error('Push failed'));

    const request: VerificationRequest = {
      uid: 'user123',
      status: 'Pending',
      user: { email: 'user@example.com', emailVerified: true, photoURL: 'http://example.com/photo.jpg' },
      text: 'Request text'
    };
    await expect(firebaseRTDB.setVerificationRequest(request)).rejects.toThrow(CustomError);
  });

  test('updateRequestStatus should update the request status', async () => {
    mockOnce.mockResolvedValue({ val: () => ({ uid: 'user123', status: 'Pending', user: { email: 'user@example.com', emailVerified: true, photoURL: 'http://example.com/photo.jpg' }, text: 'Request text' }) });
    mockUpdate.mockResolvedValue(undefined);
    const moveReviewsSpy = jest.spyOn(firebaseRTDB as any, 'moveReviews');

    const result = await firebaseRTDB.updateRequestStatus('request123', 'Approved');
    expect(result).toBe('user123');
    expect(moveReviewsSpy).toHaveBeenCalledWith('user123', '/reviews', '/criticReviews');
  });

  test('updateRequestStatus should throw a CustomError if the request is not found', async () => {
    mockOnce.mockResolvedValue({ val: () => null });

    await expect(firebaseRTDB.updateRequestStatus('request123', 'Approved')).rejects.toThrow(CustomError);
  });

  test('moveReviews should move user reviews from one path to another', async () => {
    const reviews = {
      movie1: { review1: { movieId: 1, uid: 'user123', username: 'user1', photoURL: 'http://example.com/photo.jpg', score: 5, text: 'Good' } },
      movie2: { review2: { movieId: 1, uid: 'user123', username: 'user2', photoURL: 'http://example.com/photo.jpg', score: 4, text: 'Bad' } }
    };
    mockOnce.mockResolvedValue({ val: () => reviews });
    mockUpdate.mockResolvedValue(undefined);

    await expect((firebaseRTDB as any).moveReviews('user123', '/reviews', '/criticReviews')).resolves.toBeUndefined();
  });

  test('moveReviews should throw a CustomError if the move fails', async () => {
    const reviews = {
      movie1: { review1: { movieId: 1, uid: 'user123', username: 'user1', photoURL: 'http://example.com/photo.jpg', score: 5, text: 'Good' } },
      movie2: { review2: { movieId: 1, uid: 'user123', username: 'user2', photoURL: 'http://example.com/photo.jpg', score: 4, text: 'Bad' } }
    };
    mockOnce.mockResolvedValue({ val: () => reviews });
    mockUpdate.mockRejectedValue(new Error('Update failed'));

    await expect((firebaseRTDB as any).moveReviews('user123', '/reviews', '/criticReviews')).rejects.toThrow(CustomError);
  });
});
