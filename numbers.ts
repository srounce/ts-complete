const assert_eq = <A, B extends A>() => {};

type TrimL<Input extends string> = Input extends ` ${infer Result}`
  ? TrimL<Result>
  : Input;
assert_eq<"foo", Trim<"    foo">>();

type TrimR<Input extends string> = Input extends `${infer Result} `
  ? TrimR<Result>
  : Input;
assert_eq<"foo", Trim<"foo    ">>();

type Trim<Input extends string> = TrimL<TrimR<Input>>;

assert_eq<"foo", Trim<"    foo    ">>();

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

type IntList<
  Size extends number,
  List extends number[] = []
> = List["length"] extends Size
  ? List
  : IntList<Size, [...List, List["length"]]>;

type NonZero = Exclude<keyof DigitMap, "0" | "">;
type LessThanAThousand =
  | "0"
  | keyof DigitMap
  | `${NonZero}${keyof DigitMap}`
  | `${NonZero}${keyof DigitMap}${keyof DigitMap}`;

type N<V extends number> = Add<V, 0>;
assert_eq<10, N<10>>();

type Add<A extends number, B extends number> = [
  ...IntList<A>,
  ...IntList<B>
]["length"];
assert_eq<15, Add<6, 9>>();

type OneLess<A extends number> = IntList<A> extends [infer _, ...infer Tail]
  ? Tail["length"]
  : 0;
assert_eq<9, OneLess<10>>();

type Sub<A extends number, B extends number> = B extends 0
  ? A
  : Sub<OneLess<A>, OneLess<B>>;
assert_eq<3, Sub<9, 6>>();
assert_eq<0, Sub<6, 9>>();

type Skip<n extends number, List extends [...any]> = n extends 0
  ? List
  : List extends [infer _, ...infer Tail]
  ? Skip<OneLess<n>, Tail>
  : Skip<OneLess<n>, List>;

assert_eq<[0, 1, 2], Skip<0, IntList<3>>>();
assert_eq<[2, 3, 4], Skip<2, IntList<5>>>();

type StringToNumber<
  T extends LessThanAThousand,
  A extends any[] = []
> = T extends LessThanAThousand
  ? T extends keyof [0, ...A]
    ? A["length"]
    : StringToNumber<T, [0, ...A]>
  : never;
assert_eq<10, StringToNumber<"10">>();
