import { Nil } from "./core";
import { assert_eq } from "./test";

export type DigitMap = {
  "0": 0;
  "1": 1;
  "2": 2;
  "3": 3;
  "4": 4;
  "5": 5;
  "6": 6;
  "7": 7;
  "8": 8;
  "9": 9;
};

export type ParseDigit<Input extends keyof DigitMap> = DigitMap[Input];

export type Length<T extends any[]> = T extends { length: infer L }
  ? L extends number
    ? L
    : never
  : never;

export type RangeN<
  Size extends number,
  TArray extends number[] = []
> = Length<TArray> extends Size
  ? TArray
  : RangeN<Size, [...TArray, Length<TArray>]>;

export type NonZero = Exclude<keyof DigitMap, "0">;
export type ValidNumberLiteral =
  | keyof DigitMap
  | `${NonZero}${keyof DigitMap}`
  | `${NonZero}${keyof DigitMap}${keyof DigitMap}`;

export type N<V extends number> = Add<V, 0>;
assert_eq<10, N<10>>();

export type Add<A extends number, B extends number> = Length<
  [...RangeN<A>, ...RangeN<B>]
>;
assert_eq<3, Add<1, 2>>();
assert_eq<0, Add<0, 0>>();

export type OneLess<A extends number> = RangeN<A> extends [
  infer _,
  ...infer Tail
]
  ? Length<Tail>
  : 0;
assert_eq<9, OneLess<10>>();

export type Sub<A extends number, B extends number> = A extends 0
  ? B extends 0
    ? 0
    : Nil
  : B extends 0
  ? A
  : Sub<OneLess<A>, OneLess<B>>;
assert_eq<4, Sub<9, 5>>();
assert_eq<0, Sub<1, 1>>();
assert_eq<Nil, Sub<5, 10>>();

type MulImpl<
  Value extends number,
  Times extends number,
  Result extends number = 0
> = Times extends 0
  ? Result
  : MulImpl<Value, OneLess<Times>, Add<Value, Result>>;

export type Mul<A extends number, B extends number> = MulImpl<A, B>;
assert_eq<1, Mul<1, 1>>();
assert_eq<4, Mul<2, 2>>();

type PowImpl<
  Value extends number,
  Times extends number,
  Result extends number = 0,
  I extends number = 0
> = I extends Times
  ? Times extends 0
    ? 1
    : Result
  : I extends 0
  ? PowImpl<Value, Times, Mul<1, Value>, Add<I, 1>>
  : PowImpl<Value, Times, Mul<Result, Value>, Add<I, 1>>;

export type Pow<A extends number, B extends number> = PowImpl<A, B>;
assert_eq<1, Pow<0, 0>>();
assert_eq<0, Pow<0, 1>>();
assert_eq<1, Pow<1, 0>>();
assert_eq<4, Pow<2, 2>>();
assert_eq<256, Pow<4, 4>>();

type StringToNumberImpl<
  Input extends ValidNumberLiteral,
  A extends [...any] = []
> = Input extends ValidNumberLiteral
  ? Input extends keyof [0, ...A]
    ? Length<A>
    : StringToNumberImpl<Input, [0, ...A]>
  : Nil;

export type StringToNumber<Input extends ValidNumberLiteral> =
  StringToNumberImpl<Input>;

assert_eq<10, StringToNumber<"10">>();
