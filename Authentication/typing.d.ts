// so the typescript compiler doesn't complain about the global config object
declare var config: any;

/*
A custom typings file is used to declare TypeScript types that are created outside of the Angular application, 
so the TypeScript compiler is aware of them and doesn't give you compile errors about unknown types. 
This typings file contains a declaration for the global config object created by webpack
 */