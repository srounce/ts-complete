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
