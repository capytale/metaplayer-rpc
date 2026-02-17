export type NumericEvaluation = {
    score: number;
    scoreMax: number;
}

export type StringEvaluation = {
    score: string;
}

export type Evaluation = {
    evalLabel: string;
    evalTitle?: string;
    comment?: string;
    date?: Date | string;
} & (NumericEvaluation | StringEvaluation);
