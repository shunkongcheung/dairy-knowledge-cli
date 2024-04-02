import { Token } from 'marked';

export const getBaseComponentFromToken = (token: Token) => ({ text: "text" in token ? token.text : token.raw });
