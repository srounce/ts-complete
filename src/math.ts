import { Nil } from "./core";
import { ValidNumberLiteral } from "./numbers";
import { Trim } from "./string";
import { assert_eq } from "./test";

type ParseError<Input extends string> = Input extends never
  ? never
  : `Error: ${Input}`;

type Expression<Input extends string> = Input extends ""
  ? ParseError<`Invalid Expression: '${Input}'`>
  : Input extends `${infer LHS}-${infer RHS}`
  ? {
      type: "SUB";
      lhs: Expression<Trim<LHS>>;
      rhs: Expression<Trim<RHS>>;
      source: Input;
    }
  : Input extends `${infer LHS}+${infer RHS}`
  ? {
      type: "ADD";
      lhs: Expression<Trim<LHS>>;
      rhs: Expression<Trim<RHS>>;
      source: Input;
    }
  : Input extends `${infer LHS}*${infer RHS}`
  ? {
      type: "MUL";
      lhs: Expression<Trim<LHS>>;
      rhs: Expression<Trim<RHS>>;
      source: Input;
    }
  : Input extends `${infer LHS}/${infer RHS}`
  ? {
      type: "DIV";
      lhs: Expression<Trim<LHS>>;
      rhs: Expression<Trim<RHS>>;
      source: Input;
    }
  : { type: "VALUE"; value: Input };

{
  type Expected = {
    type: "SUB";
    lhs: { type: "VALUE"; value: "1" };
    rhs: {
      type: "ADD";
      lhs: { type: "VALUE"; value: "2" };
      rhs: { type: "VALUE"; value: "3" };
    };
  };

  assert_eq<Expected, Expression<"1 - 2 + 3">>();
}

{
  type Expected = {
    type: "ADD";
    lhs: { type: "VALUE"; value: "1" };
    rhs: {
      type: "MUL";
      lhs: { type: "VALUE"; value: "2" };
      rhs: { type: "VALUE"; value: "3" };
    };
  };

  assert_eq<Expected, Expression<"1 + 2 * 3">>();
}

{
  type Expected = {
    type: "MUL";
    lhs: { type: "VALUE"; value: "1" };
    rhs: {
      type: "DIV";
      lhs: { type: "VALUE"; value: "2" };
      rhs: { type: "VALUE"; value: "3" };
    };
  };

  assert_eq<Expected, Expression<"1 * 2 / 3">>();
}
