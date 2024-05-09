interface UserData {
    email: string;
    profile_pic: string;
    username: string;
    verified: boolean;
}

export interface user_firebase_rtdb {
    [userId: string]: UserData;
}
