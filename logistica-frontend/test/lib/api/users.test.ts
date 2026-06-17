import { describe, it, expect, beforeEach } from "vitest"
import { server } from "@/test/msw/server"
import { usersHandlers } from "@/test/handlers/users"
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  getPermissions,
} from "@/lib/api/users"
import { setTokens, clearTokens } from "@/lib/api/client"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...usersHandlers)
})

describe("getUsers", () => {
  it("returns paginated response directly", async () => {
    const res = await getUsers(1)
    expect(res.count).toBe(2)
    expect(res.results).toHaveLength(2)
    expect(res.results[0].username).toBe("admin")
  })

  it("accepts page parameter", async () => {
    const res = await getUsers(2)
    expect(res.results).toHaveLength(0)
  })
})

describe("getUser", () => {
  it("returns user detail directly", async () => {
    const res = await getUser(1)
    expect(res.username).toBe("admin")
    expect(res.email).toBe("admin@test.com")
  })

  it("throws on 404", async () => {
    await expect(getUser(999)).rejects.toThrow()
  })
})

describe("createUser", () => {
  it("creates user and returns directly", async () => {
    const res = await createUser({ username: "nuevo", password: "pass123" })
    expect(res.id).toBe(3)
    expect(res.username).toBe("nuevo")
  })

  it("throws on 400 with missing fields", async () => {
    await expect(createUser({} as never)).rejects.toThrow()
  })
})

describe("updateUser", () => {
  it("updates and returns user directly", async () => {
    const res = await updateUser(1, { first_name: "Admin Editado" })
    expect(res.first_name).toBe("Admin Editado")
  })
})

describe("deleteUser", () => {
  it("deletes user", async () => {
    await expect(deleteUser(1)).resolves.toBeUndefined()
  })
})

describe("getGroups", () => {
  it("returns groups list directly", async () => {
    const res = await getGroups()
    expect(res).toHaveLength(2)
    expect(res[0].name).toBe("admin")
  })
})

describe("getGroup", () => {
  it("returns group detail directly", async () => {
    const res = await getGroup(1)
    expect(res.name).toBe("admin")
  })
})

describe("createGroup", () => {
  it("creates group and returns directly", async () => {
    const res = await createGroup({ name: "new-group" })
    expect(res.id).toBe(3)
    expect(res.name).toBe("new-group")
  })
})

describe("updateGroup", () => {
  it("updates and returns group directly", async () => {
    const res = await updateGroup(1, { name: "admin-edit" })
    expect(res.name).toBe("admin-edit")
  })
})

describe("deleteGroup", () => {
  it("deletes group", async () => {
    await expect(deleteGroup(1)).resolves.toBeUndefined()
  })
})

describe("getPermissions", () => {
  it("returns permissions list directly", async () => {
    const res = await getPermissions()
    expect(res).toHaveLength(2)
    expect(res[0].codename).toBe("view_warehouse")
  })
})
