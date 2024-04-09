type MessageKeys<ObjectType, Keys extends string> = {
  [Property in Keys]: NestedValueOf<ObjectType, Property> extends string
    ? Property
    : never;
}[Keys];

type NamespaceKeys<ObjectType, Keys extends string> = {
  [Property in Keys]: NestedValueOf<ObjectType, Property> extends string
    ? never
    : Property;
}[Keys];

type NestedKeyOf<ObjectType> = ObjectType extends object
  ? {
      [Key in keyof ObjectType]:
        | `${Key & string}`
        | `${Key & string}.${NestedKeyOf<ObjectType[Key]>}`;
    }[keyof ObjectType]
  : never;

type NestedValueOf<
  ObjectType,
  Property extends string,
> = Property extends `${infer Key}.${infer Rest}`
  ? Key extends keyof ObjectType
    ? NestedValueOf<ObjectType[Key], Rest>
    : never
  : Property extends keyof ObjectType
  ? ObjectType[Property]
  : never;

type NestedKeyConstraint = NamespaceKeys<
  IntlMessages,
  NestedKeyOf<IntlMessages>
>;

export type TFunction<NestedKey extends NestedKeyConstraint = never> = <
  TargetKey extends MessageKeys<
    NestedValueOf<
      { "!": IntlMessages },
      [NestedKey] extends [never] ? "!" : `!.${NestedKey}`
    >,
    NestedKeyOf<
      NestedValueOf<
        { "!": IntlMessages },
        [NestedKey] extends [never] ? "!" : `!.${NestedKey}`
      >
    >
  >,
>(
  key: TargetKey,
  values?: Record<string, string | number | boolean | Date | null | undefined>,
) => string;

export const loadMessages = async (locale = "en") =>
  (
    (await import(`~/../public/locales/${locale ?? "en"}.json`)) as {
      default: IntlMessages;
    }
  ).default;
