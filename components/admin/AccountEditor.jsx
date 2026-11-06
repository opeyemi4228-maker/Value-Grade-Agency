"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { saveAccount } from "@/app/admin/accounts-actions";

const input = "h-10 w-full rounded-lg border border-line bg-white px-3 text-[13.5px] text-forest outline-none focus:border-forest/50";

export default function AccountEditor({ account, campaigns }) {
  const [state, action, pending] = useActionState(saveAccount, {});
  const linked = new Set(account.campaignIds);
  const known = new Set(campaigns.map((c) => c.campaignId));
  const unknownLinked = account.campaignIds.filter((id) => !known.has(id));

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={account.id} />
      <input type="hidden" name="type" value={account.type} />

      {account.type === "client" ? (
        <fieldset>
          <legend className="text-[12.5px] font-bold text-forest">Grade campaigns this client can see</legend>
          {campaigns.length ? (
            <div className="mt-2 grid max-h-56 gap-1.5 overflow-y-auto rounded-lg border border-line p-2 sm:grid-cols-2">
              {campaigns.map((c) => (
                <label key={c.campaignId} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-forest hover:bg-soft">
                  <input type="checkbox" name="campaigns" value={c.campaignId} defaultChecked={linked.has(c.campaignId)} className="size-4 accent-[#002F1F]" />
                  <span className="truncate">{c.campaignName}</span>
                  <span className="ml-auto shrink-0 text-[11px] text-forest/40">{c.campaignStatus}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-[12.5px] text-forest/55">Couldn&apos;t load campaigns from Grade. Paste campaign IDs below.</p>
          )}
          <label className="mt-3 block text-[12px] font-semibold text-forest/70">Other campaign IDs (comma separated)
            <input name="extraCampaigns" defaultValue={unknownLinked.join(", ")} className={`${input} mt-1`} />
          </label>
        </fieldset>
      ) : (
        <label className="block text-[12.5px] font-bold text-forest">Grade email (where VGA pays this creator)
          <input name="gradeEmail" type="email" defaultValue={account.grade_email || ""} placeholder={account.email} className={`${input} mt-1`} />
          <span className="mt-1 block text-[11.5px] font-normal text-forest/50">Leave blank to use their login email ({account.email}).</span>
        </label>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <label className="text-[12.5px] font-bold text-forest">Status
          <select name="status" defaultValue={account.status} className={`${input} mt-1 w-40`}>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </label>
        <button type="submit" disabled={pending} className="inline-flex h-10 items-center gap-2 rounded-lg bg-forest px-4 text-[13px] font-bold text-soft hover:bg-orange hover:text-ink disabled:opacity-60">
          {pending && <Loader2 className="size-4 animate-spin" />} Save
        </button>
        {state?.error && <span role="alert" className="text-[12.5px] font-semibold text-red-700">{state.error}</span>}
        {state?.message && <span role="status" className="text-[12.5px] font-semibold text-emerald-700">{state.message}</span>}
      </div>
    </form>
  );
}
