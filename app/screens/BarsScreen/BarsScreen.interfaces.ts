export interface IBarsUserMark {
    discipline: string;
    semester: string[],
    final: string[]
}

export interface IBarsUser {
    _id: string;
    username: string;
    updatedAt: string;
    marks: IBarsUserMark[];
    isCredentialsError: boolean;
}
