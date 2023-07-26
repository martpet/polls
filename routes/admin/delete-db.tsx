import { HandlerContext, Handlers } from "$fresh/server.ts";

import { resetDB } from "🛠️/db.ts";
import { checkProd } from "🛠️/host.ts";

import Button from "🧱/Button.tsx";
import { Input } from "🧱/FormField.tsx";
import AdminView from "🧱/views/AdminView.tsx";

export const handler: Handlers = {
  GET(_req: Request, ctx: HandlerContext) {
    return ctx.render();
  },
  async POST() {
    await resetDB();
    return new Response(null, {
      headers: { Location: "/" },
      status: 303,
    });
  },
};

export default function DeleteDBPage() {
  if (checkProd()) {
    return (
      <AdminView>
        Базата данни не може да бъде изтрита в <em>Production</em>.
      </AdminView>
    );
  }

  return (
    <AdminView headline="Изтриване на базата данни">
      <form method="post">
        <Input
          required
          type="checkbox"
          label="Ще изтрия всичко"
        />
        <Button danger class="mt-5">Изтрий</Button>
      </form>
    </AdminView>
  );
}
