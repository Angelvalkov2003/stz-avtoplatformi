"use client";

import { useActionState } from "react";
import { loginAction, type AdminState } from "@/app/actions/admin";
import { Button } from "@/components/ui/Button";

const initial: AdminState = { ok: false };

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-display text-2xl font-semibold">Админ вход</h1>
      <p className="mt-2 text-sm text-steel">Само за управление на резервации.</p>
      <form action={action} className="mt-8 space-y-4 border border-silver p-5">
        <label className="block text-sm">
          <span className="mb-1 block text-steel">Парола</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="w-full border border-silver px-3 py-2.5 outline-none focus:border-graphite"
          />
        </label>
        {state.message ? (
          <p className="text-sm text-steel" role="alert">
            {state.message}
          </p>
        ) : null}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Вход…" : "Вход"}
        </Button>
      </form>
    </div>
  );
}
