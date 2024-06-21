export interface IParticipant {
    id: number;
    name: string;
    gender: 'MALE' | 'FEMALE';
    birthDate: string;
    club: string;
    disciplines?: IDiscipline[];
}

export interface IDiscipline {
    id: number;
    name: string;
    resultType: 'TIME' | 'DISTANCE' | 'POINTS';
    participants?: IParticipant[];
}

export interface IResult {
    id: number;
    participantName: string;
    disciplineName: string;
    date: string;
    resultValue: string;
}


