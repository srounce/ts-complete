import { Nil } from "./core";

type NotNever<T> = [T] extends [never] ? Nil : T;
assert_eq<Nil, NotNever<never>>();
assert_eq<1, NotNever<1>>();
assert_eq<1, NotNever<1>>();

export function assert_eq<
  Expected,
  Recieved extends Expected,
  T extends NotNever<Recieved> = never
>() {}
assert_eq<1, 1>();
assert_eq<Nil, never>();
assert_eq<Nil, Nil>();
assert_eq<{ field: true }, { field: true; other: false }>();
// assert_eq<{ field: true; other: false }, { field: true }>(); // Should Fail
