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

type Stringable = string | number | bigint | boolean | null;
export type ToString<Value extends Stringable> = `${Value}`;
assert_eq<"123", ToString<123>>();
assert_eq<"foo", ToString<"foo">>();
assert_eq<"321", ToString<321n>>();
assert_eq<"true", ToString<true>>();
assert_eq<"null", ToString<null>>();

export type Replace<
  Input extends string,
  Match extends string,
  Replacement extends string = ""
> = Input extends `${Match}${infer Rest}`
  ? `${Replacement}${Rest}`
  : Input extends `${infer Rest}${Match}`
  ? `${Rest}${Replacement}`
  : Input extends Match
  ? Replacement
  : Input;
assert_eq<"hello", Replace<"hello", "">>();
assert_eq<"", Replace<"hello", "hello">>();
assert_eq<" bob", Replace<"hello bob", "hello">>();
assert_eq<"goodbye", Replace<"hello", "hello", "goodbye">>();
assert_eq<"hello jane", Replace<"hello bob", "bob", "jane">>();
assert_eq<"goodbye bob", Replace<"hello bob", "hello", "goodbye">>();
assert_eq<" bob", Replace<"bob bob", "bob">>();

export type ReplaceAll<
  Input extends string,
  Match extends string,
  Replacement extends string = ""
> = Contains<Match, Input> extends true
  ? ReplaceAll<Replace<Input, Match, Replacement>, Match, Replacement>
  : Input;
assert_eq<"", ReplaceAll<"11111", "1">>();
assert_eq<" ", ReplaceAll<"bob bob", "bob">>();
