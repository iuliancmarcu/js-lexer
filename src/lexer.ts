/* 
  Copyright 2021 Iulian Marcu

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import { isAlphanumeric, isKeyword, isNumber } from './utils';

export enum TokenType {
  KEYWORD = 'keyword',
  IDENTIFIER = 'identifier',
  NUMBER = 'number',
  ROUND_OPEN = 'round_open',
  ROUND_CLOSE = 'round_close',
  SQUARE_OPEN = 'square_open',
  SQUARE_CLOSE = 'square_close',
  CURLY_OPEN = 'curly_open',
  CURLY_CLOSE = 'curly_close',
  SEMICOLON = 'semicolon',
  ARROW = 'arrow',
  STRING = 'string',
}

export interface Position {
  row: number;
  column: number;
  index: number;
}

export interface Token {
  start: Position;
  end: Position;
  type: TokenType;
}

export class Lexer {
  private position: Position = { index: 0, row: 0, column: 0 };

  private tokens: Array<Token> = [];

  private startPosition?: Position;

  constructor(private code: string) {}

  public tokenize() {
    while (this.position.index < this.code.length) {
      if (this.peek() === '(') {
        this.addToken(TokenType.ROUND_OPEN);
        this.consume();
        continue;
      }

      if (this.peek() === ')') {
        this.addToken(TokenType.ROUND_CLOSE);
        this.consume();
        continue;
      }

      if (this.peek() === '[') {
        this.addToken(TokenType.SQUARE_OPEN);
        this.consume();
        continue;
      }

      if (this.peek() === ']') {
        this.addToken(TokenType.SQUARE_CLOSE);
        this.consume();
        continue;
      }

      if (this.peek() === '{') {
        this.addToken(TokenType.CURLY_OPEN);
        this.consume();
        continue;
      }

      if (this.peek() === '}') {
        this.addToken(TokenType.CURLY_CLOSE);
        this.consume();
        continue;
      }

      if (this.peek() === ';') {
        this.addToken(TokenType.SEMICOLON);
        this.consume();
        continue;
      }

      if (this.peek() === '`') {
        this.startToken();
        this.consume();

        // consume content
        this.consumeWhile(() => this.peek() !== '`');

        const { start, end } = this.endToken();
        this.addToken(TokenType.STRING, start, end);
        this.consume();
        continue;
      }

      if (this.peek() === '"') {
        this.startToken();
        this.consume();

        // consume content
        this.consumeWhile(() => this.peek() !== '"');

        const { start, end } = this.endToken();
        this.addToken(TokenType.STRING, start, end);
        this.consume();
        continue;
      }

      if (this.peek() === "'") {
        this.startToken();
        this.consume();

        // consume content
        this.consumeWhile(() => this.peek() !== "'");

        const { start, end } = this.endToken();
        this.addToken(TokenType.STRING, start, end);
        this.consume();
        continue;
      }

      if (this.peek() === '=' && this.peek(1) === '>') {
        this.addToken(TokenType.ARROW);
        this.consume();
        this.consume();
        continue;
      }

      if (isAlphanumeric(this.peek())) {
        this.startToken();

        this.consumeWhile(() => isAlphanumeric(this.peek(1)));

        const { start, end } = this.endToken();
        const value = this.code.substring(start.index, end.index + 1);

        let tokenType = TokenType.IDENTIFIER;
        if (isNumber(value)) {
          tokenType = TokenType.NUMBER;
        } else if (isKeyword(value)) {
          tokenType = TokenType.KEYWORD;
        }

        this.addToken(tokenType, start, end);

        this.consume();
        continue;
      }

      this.consume();
    }
  }

  public getTokens() {
    return this.tokens;
  }

  private consumeWhile(fn: () => boolean) {
    while (fn() && this.position.index < this.code.length) {
      this.consume();
    }
  }

  private startToken() {
    this.startPosition = { ...this.position };
  }

  private endToken() {
    if (!this.startPosition) {
      throw new Error('endToken called before startToken');
    }

    return {
      start: this.startPosition,
      end: { ...this.position },
    };
  }

  private addToken(
    type: TokenType,
    start: Position = { ...this.position },
    end: Position = { ...this.position },
  ) {
    this.tokens.push({ start, end, type });
  }

  private peek(offset: number = 0) {
    return this.code.charAt(this.position.index + offset);
  }

  private consume() {
    this.position.column++;
    if (this.code[this.position.index] === '\n') {
      this.position.column = 0;
      this.position.row++;
    }

    this.position.index++;
  }
}
