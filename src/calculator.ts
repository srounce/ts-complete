import { Add, Div, Mul, Pow, Sub } from "./numbers";
import {
  AddNode,
  DivNode,
  Expression,
  MulNode,
  PowNode,
  SubNode,
  ValueNode,
} from "./math";
import { assert_eq } from "./test";
import { Nil } from "./core";

type Calculator<Expr> = Expr extends SubNode<infer LHS, infer RHS>
  ? Sub<Calculator<LHS>, Calculator<RHS>>
  : Expr extends AddNode<infer LHS, infer RHS>
  ? Add<Calculator<LHS>, Calculator<RHS>>
  : Expr extends MulNode<infer LHS, infer RHS>
  ? Mul<Calculator<LHS>, Calculator<RHS>>
  : Expr extends DivNode<infer LHS, infer RHS>
  ? Div<Calculator<LHS>, Calculator<RHS>>
  : Expr extends PowNode<infer LHS, infer RHS>
  ? Pow<Calculator<LHS>, Calculator<RHS>>
  : //   : { type: "UnsupportedOperation"; op: Input }
  Expr extends ValueNode<infer Value>
  ? Expr["value"]
  : Nil;

{
  type Input = ValueNode<1>;
  assert_eq<1, Calculator<Input>>();
}
{
  type Input = Expression<"2 + 2">;
  assert_eq<4, Calculator<Input>>();
}
{
  type Input = AddNode<ValueNode<1>, AddNode<ValueNode<1>, ValueNode<1>>>;
  assert_eq<3, Calculator<Input>>();
}
