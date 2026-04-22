import { ZodSchema } from "zod";

export async function parseJsonBody<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<{ success: true; data: T } | { success: false; response: Response }> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return {
      success: false,
      response: Response.json({ error: "Invalid JSON" }, { status: 400 }),
    };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      success: false,
      response: Response.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 }),
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
}

export function internalServerError(): Response {
  return Response.json({ error: "Internal server error" }, { status: 500 });
}
