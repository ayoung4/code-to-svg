export type Configuration = {
    lineHeight: number;
    width: number;
    maxParallelism: number;
    dirpath: string
};

export const DEFAULTS: Configuration = {
    lineHeight: 20,
    width: 1000,
    maxParallelism: 10,
    dirpath: '.',
};
