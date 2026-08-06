declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.css" {
  const content: { [key: string]: string };
  export default content;
}