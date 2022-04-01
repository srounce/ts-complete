import { assert_eq } from "./test";

type DigitMap = {
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

type ParseDigit<Input extends keyof DigitMap> = DigitMap[Input];

type Nil = {
  ".": Nil;
};

type RangeN<
  Size extends number,
  TArray extends number[] = []
> = TArray["length"] extends Size
  ? TArray
  : RangeN<Size, [...TArray, TArray["length"]]>;

type NonZero = Exclude<keyof DigitMap, "0" | "">;
type ValidNumberLiteral =
  | keyof DigitMap
  | `${NonZero}${keyof DigitMap}`
  | `${NonZero}${keyof DigitMap}${keyof DigitMap}`;

type N<V extends number> = Add<V, 0>;
assert_eq<10, N<10>>();

type Add<A extends number, B extends number> = [
  ...RangeN<A>,
  ...RangeN<B>
]["length"];
assert_eq<3, Add<1, 2>>();

type OneLess<A extends number> = RangeN<A> extends [infer _, ...infer Tail]
  ? Tail["length"]
  : 0;
assert_eq<9, OneLess<10>>();

type Sub<A extends number, B extends number> = A extends 0
  ? B extends 0
    ? 0
    : never
  : B extends 0
  ? A
  : Sub<OneLess<A>, OneLess<B>>;
assert_eq<4, Sub<9, 5>>();
assert_eq<0, Sub<1, 1>>();
assert_eq<never, Sub<5, 10>>();

type Skip<n extends number, TArray extends [...any]> = n extends 0
  ? TArray
  : TArray extends [infer _, ...infer Tail]
  ? Skip<OneLess<n>, Tail>
  : never;

assert_eq<[0, 1, 2], Skip<0, RangeN<3>>>();
assert_eq<[2, 3, 4], Skip<2, RangeN<5>>>();
assert_eq<never, Skip<2, RangeN<0>>>();

type Take<
  n extends number,
  List extends [...any],
  ToArray extends [...any] = []
> = n extends 0
  ? ToArray
  : List extends [infer Head, ...infer Tail]
  ? Take<OneLess<n>, Tail, [...ToArray, Head]>
  : never;

assert_eq<[], Take<0, RangeN<3>>>();
assert_eq<[0, 1], Take<2, RangeN<5>>>();
assert_eq<[0, 1], Take<3, RangeN<2>>>();

type StringToNumber<
  T extends ValidNumberLiteral,
  A extends any[] = []
> = T extends ValidNumberLiteral
  ? T extends keyof [0, ...A]
    ? A["length"]
    : StringToNumber<T, [0, ...A]>
  : never;
assert_eq<10, StringToNumber<"10">>();
