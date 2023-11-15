import { safeCoercePrimitive } from "../../zod.ts"
import { assert, z } from "../deps.ts"

Deno.test("zod - safeCoercePrimitive()", async (t) => {
  await t.step("Should correctly coerce and parse as number", () => {
    const p1 = safeCoercePrimitive("10", z.number())
    const p2 = safeCoercePrimitive(10n, z.number())
    const p3 = safeCoercePrimitive(true, z.number())
    const p4 = safeCoercePrimitive(new Date(), z.number())

    assert(p1.success)
    assert(p2.success)
    assert(p3.success)
    assert(p4.success)

    assert(typeof p1.data === "number")
    assert(typeof p2.data === "number")
    assert(typeof p3.data === "number")
    assert(typeof p4.data === "number")
  })

  await t.step("Should correctly coerce and parse as string", () => {
    const p1 = safeCoercePrimitive("10", z.string())
    const p2 = safeCoercePrimitive(10n, z.string())
    const p3 = safeCoercePrimitive(true, z.string())
    const p4 = safeCoercePrimitive(new Date(), z.string())

    assert(p1.success)
    assert(p2.success)
    assert(p3.success)
    assert(p4.success)

    assert(typeof p1.data === "string")
    assert(typeof p2.data === "string")
    assert(typeof p3.data === "string")
    assert(typeof p4.data === "string")
  })

  await t.step("Should correctly coerce and parse as boolean", () => {
    const p1 = safeCoercePrimitive("10", z.boolean())
    const p2 = safeCoercePrimitive(10n, z.boolean())
    const p3 = safeCoercePrimitive(true, z.boolean())
    const p4 = safeCoercePrimitive(new Date(), z.boolean())

    assert(p1.success)
    assert(p2.success)
    assert(p3.success)
    assert(p4.success)

    assert(typeof p1.data === "boolean")
    assert(typeof p2.data === "boolean")
    assert(typeof p3.data === "boolean")
    assert(typeof p4.data === "boolean")
  })

  await t.step("Should correctly coerce and parse as bigint", () => {
    const p1 = safeCoercePrimitive("10", z.bigint())
    const p2 = safeCoercePrimitive(10n, z.bigint())
    const p3 = safeCoercePrimitive(true, z.bigint())
    const p4 = safeCoercePrimitive(new Date(), z.bigint())

    assert(p1.success)
    assert(p2.success)
    assert(p3.success)
    assert(p4.success)

    assert(typeof p1.data === "bigint")
    assert(typeof p2.data === "bigint")
    assert(typeof p3.data === "bigint")
    assert(typeof p4.data === "bigint")
  })

  await t.step("Should correctly coerce and parse as date", () => {
    const p1 = safeCoercePrimitive("10", z.date())
    const p2 = safeCoercePrimitive(true, z.date())
    const p3 = safeCoercePrimitive(new Date(), z.date())

    assert(p1.success)
    assert(p2.success)
    assert(p3.success)

    assert(typeof p1.data === "object")
    assert(typeof p2.data === "object")
    assert(typeof p3.data === "object")
  })
})
