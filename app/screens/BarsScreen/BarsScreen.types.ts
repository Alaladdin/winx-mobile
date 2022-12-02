export interface IBarsMark {
    discipline: string;
    semester: string[],
    final: string[]
}

export interface IBarsUser {
    _id: string;
    username: string;
    updatedAt: string;
    marks: IBarsMark[];
    isCredentialsError: boolean;
}
