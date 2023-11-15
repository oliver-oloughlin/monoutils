import { assert, z } from "../deps.ts"
import { safeCoerceObject } from "../../zod.ts"

const ObjectSchema = z.object({
  number: z.number(),
  string: z.string(),
  boolean: z.boolean(),
  bigint: z.date(),
  date: z.date(),
})

Deno.test("zod - safeCoerceObject()", async (t) => {
  await t.step("Should correctly coerce and parse object", () => {
    const parsed = safeCoerceObject({
      number: "10",
      string: 10,
      boolean: 1,
      bigint: new Date(),
      date: "10",
    }, ObjectSchema)

    assert(parsed.success)
    assert(typeof parsed.data === "object")
  })

  await t.step("Should correctly coerce and parse object", () => {
    const parsed = safeCoerceObject(
      {
        nested: {
          number: "10",
          string: 10,
          boolean: 1,
          bigint: new Date(),
          date: "10",
        },
      },
      z.object({
        nested: ObjectSchema,
      }),
    )

    assert(parsed.success)
    assert(typeof parsed.data === "object")
  })

  await t.step("Should correctly coerce and parse object", () => {
    const parsed = safeCoerceObject(
      {
        arr: [1, 2, 3],
      },
      z.object({
        arr: z.array(z.number()),
      }),
    )

    assert(parsed.success)
  })

  await t.step("Should fail to coerce and parse object", () => {
    const parsed = safeCoerceObject({
      number: "10",
      string: 10,
      boolean: 1,
      bigint: new Date(),
    }, ObjectSchema)

    assert(!parsed.success)
  })

  await t.step("Should fail to coerce and parse object", () => {
    try {
      safeCoerceObject({
        number: "10",
        string: 10,
        boolean: 1,
        bigint: new Date(),
        date: 10n,
      }, ObjectSchema)

      assert(false)
    } catch (_) {
      assert(true)
    }
  })
})
