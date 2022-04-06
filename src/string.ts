import { assert_eq } from "./test";

export type TrimL<Input extends string> = Input extends ` ${infer Result}`
  ? TrimL<Result>
  : Input;
assert_eq<"foo", TrimL<"    foo">>();

export type TrimR<Input extends string> = Input extends `${infer Result} `
  ? TrimR<Result>
  : Input;
assert_eq<"foo", TrimR<"foo    ">>();

export type Trim<Input extends string> = TrimL<TrimR<Input>>;
assert_eq<"foo", Trim<"    foo    ">>();

export type Contains<
  Value extends string,
  InString extends string
> = InString extends `${infer Before}${Value}${infer After}` ? true : false;
assert_eq<true, Contains<"foo", "foobar">>();
assert_eq<true, Contains<"bar", "foobar">>();
assert_eq<true, Contains<"oba", "foobar">>();
assert_eq<false, Contains<"boa", "foobar">>();
