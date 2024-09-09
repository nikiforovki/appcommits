declare module 'svg-inline-loader';
declare module 'dotenv-webpack';

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}
