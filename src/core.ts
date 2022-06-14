import { assert_eq } from "./test";

const nil = Symbol("Nil");

export type Nil = { [nil]: typeof nil };

export type Not<Input extends boolean> = Input extends true ? false : true;

export type And<A extends boolean, B extends boolean> = [A, B] extends [
  true,
  true
]
  ? true
  : false;
assert_eq<true, And<true, true>>();
assert_eq<false, And<true, false>>();
assert_eq<false, And<false, true>>();
assert_eq<false, And<false, false>>();

export type Or<A extends boolean, B extends boolean> = true extends A | B
  ? true
  : false;
assert_eq<true, Or<true, true>>();
assert_eq<true, Or<true, false>>();
assert_eq<true, Or<false, true>>();
assert_eq<false, Or<false, false>>();

export type Xor<A extends boolean, B extends boolean> = A extends B
  ? false
  : true;
assert_eq<false, Xor<true, true>>();
assert_eq<true, Xor<true, false>>();
assert_eq<true, Xor<false, true>>();
assert_eq<false, Xor<false, false>>();
