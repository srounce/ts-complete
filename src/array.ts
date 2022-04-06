import { Nil } from "./core";
import { OneLess, RangeN } from "./numbers";
import { assert_eq } from "./test";

type Skip<n extends number, Input extends [...any]> = n extends 0
  ? Input
  : Input extends [infer _, ...infer Tail]
  ? Skip<OneLess<n>, Tail>
  : Nil;

assert_eq<[0, 1, 2], Skip<0, RangeN<3>>>();
assert_eq<[2, 3, 4], Skip<2, RangeN<5>>>();
assert_eq<Nil, Skip<2, RangeN<0>>>();

type Take<
  n extends number,
  List extends [...any],
  Result extends [...any] = []
> = n extends 0
  ? Result
  : List extends [infer Head, ...infer Tail]
  ? Take<OneLess<n>, Tail, [...Result, Head]>
  : Result;

assert_eq<[], Take<0, RangeN<3>>>();
assert_eq<[0, 1], Take<2, RangeN<5>>>();
assert_eq<[0, 1], Take<3, RangeN<2>>>();

export type Append<T, Input extends [...any]> = [...Input, T];
assert_eq<[true], Append<true, []>>();
assert_eq<[1, 2, 3], Append<3, [1, 2]>>();

export type Pop<Input extends [...any]> = Input["length"] extends 0
  ? Nil
  : Input extends [...infer Result, Last<Input>]
  ? Result
  : Nil;
assert_eq<Nil, Pop<[]>>();
assert_eq<[1, 2], Pop<[1, 2, 3]>>();

export type Shift<Input extends [...any]> = Input["length"] extends 0
  ? Nil
  : Input extends [infer _, ...infer Result]
  ? Result
  : Nil;
assert_eq<Nil, Shift<[]>>();
assert_eq<[2, 3], Shift<[1, 2, 3]>>();

export type First<Input extends [...any]> = Input extends [
  infer T,
  ...infer Rest
]
  ? T
  : Nil;
assert_eq<Nil, First<[]>>();
assert_eq<1, First<[1, 2, 3]>>();

export type Last<Input extends [...any]> = Input["length"] extends 0
  ? Nil
  : Input[OneLess<Input["length"]>];
assert_eq<Nil, Last<[]>>();
assert_eq<3, Last<[1, 2, 3]>>();
