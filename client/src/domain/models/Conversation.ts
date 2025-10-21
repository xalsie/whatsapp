export interface IConversation {
    __v: number;
    _id: string;
    id: string;
    name: string;
    members: string[];
    admin: string;
    blockedUsers?: string[];
    updatedAt: string;
    createdAt: Date;
}

export interface IPopulatedConversation {
    __v: number;
    _id: string;
    name: string;
    members: Array<{
        _id: string;
        username: string;
        email: string;
    }>;
    admin: {
        _id: string;
        username: string;
        email: string;
    } | string;
    blockedUsers?: string[];
    updatedAt: string;
    createdAt: Date;
}
