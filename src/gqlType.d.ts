declare module '*.graphql' {
    const content: string;
    export default content;
}
// Well, this makes tsc happy :(
