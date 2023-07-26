import { HandlerContext, Handlers } from "$fresh/server.ts";

import { deletePhoneNumber } from "🛠️/db.ts";

import Button from "🧱/Button.tsx";
import { Input } from "🧱/FormField.tsx";
import AdminView from "🧱/views/AdminView.tsx";

export const handler: Handlers = {
  GET(_req: Request, ctx: HandlerContext) {
    return ctx.render();
  },
  async POST(req: Request) {
    const form = await req.formData();
    const phoneNumber = form.get("phone") as string;
    if (phoneNumber) await deletePhoneNumber(phoneNumber);
    return new Response(null, {
      headers: { Location: "/" },
      status: 303,
    });
  },
};

export default function DeletePhoneNumber() {
  return (
    <AdminView headline="Изтрий телефонен номер" width="sm">
      <form method="post">
        <Input
          required
          name="phone"
          type="text"
          label="Телефонен номер"
        />
        <Button danger class="mt-5">Изтрий</Button>
      </form>
    </AdminView>
  );
}
