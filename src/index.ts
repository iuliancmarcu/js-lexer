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

import { Lexer } from './lexer';
window.Lexer = Lexer;
// export * from './lexer';

// import { Lexer } from './lexer';

// const lexer = new Lexer(`
// const ONE = 1;

// function fibonacci(num) {
//   if (num <= 2) {
//     return ONE;
//   }

//   return fibonacci(num - 1) + fibonacci(num - 2);
// }

// const call = () => fibonacci(10);
// call();
// `);
// lexer.tokenize();
// console.table(
//   lexer.getTokens().map((token) => ({
//     start: `${token.start.row}:${token.start.column}`,
//     end: `${token.end.row}:${token.end.column}`,
//     type: token.type,
//   })),
// );
