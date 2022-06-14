import { Nil } from "./core";
import {
  Add,
  Div,
  Mul,
  ParseDigit,
  Pow,
  StringToNumber,
  Sub,
  ValidNumberLiteral,
} from "./numbers";
import { Contains, Replace, ReplaceAll, Trim } from "./string";
import { assert_eq } from "./test";

type ParseError<Input extends string> = Input extends never
  ? never
  : `Error: ${Input}`;

export type AddNodeId = "ADD";
export type SubNodeId = "SUB";
export type MulNodeId = "MUL";
export type DivNodeId = "DIV";
export type PowNodeId = "POW";
export type ValueNodeId = "VALUE";
export type ErrorNodeId = "ERROR";

export type RawValueNode<Value extends string> = {
  type: ValueNodeId;
  value: Value;
};

export type ValueNode<Value extends number | ValidNumberLiteral> = {
  type: ValueNodeId;
  value: Value extends ValidNumberLiteral ? StringToNumber<Value> : Value;
};

export type AddNode<LHS extends string, RHS extends string> = {
  type: AddNodeId;
  lhs: Expression<LHS>;
  rhs: Expression<RHS>;
};

export type SubNode<LHS extends string, RHS extends string> = {
  type: SubNodeId;
  lhs: Expression<LHS>;
  rhs: Expression<RHS>;
};

export type MulNode<LHS extends string, RHS extends string> = {
  type: MulNodeId;
  lhs: Expression<LHS>;
  rhs: Expression<RHS>;
};

export type DivNode<LHS extends string, RHS extends string> = {
  type: DivNodeId;
  lhs: Expression<LHS>;
  rhs: Expression<RHS>;
};

export type PowNode<LHS extends string, RHS extends string> = {
  type: PowNodeId;
  lhs: Expression<LHS>;
  rhs: Expression<RHS>;
};

// type OpToken = "**" | "/" | "*" | "+" | "-";

// type ee<Input extends string> = Input extends ""
//   ? "INVALID"
//   : Input extends `${infer LHS}${OpToken}${infer RHS}`
//   ? ReplaceAll<Input, LHS | RHS> extends "-"
//     ? SubNode<ee<LHS>, ee<RHS>>
//     : ReplaceAll<Input, LHS | RHS> extends "+"
//     ? AddNode<ee<Trim<LHS>>, ee<Trim<RHS>>>
//     : ReplaceAll<Input, LHS | RHS> extends "*"
//     ? MulNode<ee<Trim<LHS>>, ee<Trim<RHS>>>
//     : ReplaceAll<Input, LHS | RHS> extends "/"
//     ? DivNode<ee<Trim<LHS>>, ee<Trim<RHS>>>
//     : ReplaceAll<Input, LHS | RHS> extends "**"
//     ? PowNode<ee<Trim<LHS>>, ee<Trim<RHS>>>
//     : [Replace<Replace<Input, LHS>, RHS>, LHS, RHS]
//   : ValueNode<Input>;
// // : Nil;
// assert_eq<AddNode<ValueNode<"1">, ValueNode<"2">>, ee<"1 + 2">>();

export type Expression<Input extends string> = Input extends ""
  ? { type: ErrorNodeId; error: ParseError<`Invalid Expression: '${Input}'`> }
  : [Contains<"-", Input>, Input] extends [true, `${infer LHS}-${infer RHS}`]
  ? SubNode<Trim<LHS>, Trim<RHS>>
  : [Contains<"+", Input>, Input] extends [true, `${infer LHS}+${infer RHS}`]
  ? AddNode<Trim<LHS>, Trim<RHS>>
  : [Contains<`*`, Input>, Contains<`**`, Input>, Input] extends [
      true,
      false,
      `${infer LHS}*${infer RHS}`
    ]
  ? MulNode<Trim<LHS>, Trim<RHS>>
  : [Contains<"/", Input>, Input] extends [true, `${infer LHS}/${infer RHS}`]
  ? DivNode<Trim<LHS>, Trim<RHS>>
  : [Contains<"**", Input>, Input] extends [true, `${infer LHS}**${infer RHS}`]
  ? PowNode<Trim<LHS>, Trim<RHS>>
  : Input extends number
  ? ValueNode<Input>
  : Input extends ValidNumberLiteral
  ? ValueNode<Input>
  : RawValueNode<Input>;

{
  type Expected = {
    type: "SUB";
    lhs: { type: "VALUE"; value: 1 };
    rhs: {
      type: "ADD";
      lhs: { type: "VALUE"; value: 2 };
      rhs: { type: "VALUE"; value: 3 };
    };
  };

  assert_eq<Expected, Expression<"1 - 2 + 3">>();
}

{
  type Expected = {
    type: "ADD";
    lhs: { type: "VALUE"; value: 1 };
    rhs: {
      type: "MUL";
      lhs: { type: "VALUE"; value: 2 };
      rhs: { type: "VALUE"; value: 3 };
    };
  };

  assert_eq<Expected, Expression<"1 + 2 * 3">>();
}

{
  type Expected = {
    type: "MUL";
    lhs: { type: "VALUE"; value: 1 };
    rhs: {
      type: "DIV";
      lhs: { type: "VALUE"; value: 2 };
      rhs: { type: "VALUE"; value: 3 };
    };
  };

  assert_eq<Expected, Expression<"1 * 2 / 3">>();
}

{
  type Expected = {
    type: "DIV";
    lhs: { type: "VALUE"; value: 1 };
    rhs: {
      type: "POW";
      lhs: { type: "VALUE"; value: 2 };
      rhs: { type: "VALUE"; value: 3 };
    };
  };

  assert_eq<Expected, Expression<"1 / 2 ** 3">>();
}
