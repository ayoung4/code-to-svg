export type Configuration = {
    lineHeight: number;
    width: number;
    maxParallelism: number;
    dirpath: string
};

export const CONFIG: Configuration = {
    lineHeight: 20,
    width: 1000,
    maxParallelism: 10,
    dirpath: '.',
};
