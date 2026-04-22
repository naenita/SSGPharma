"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { productDivisions } from "@/lib/divisions";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseRupeesToPaise } from "@/lib/money";
import { getSaltSuggestions, addSaltSuggestion } from "@/lib/salts-storage";
import { cn } from "@/lib/utils";
import { X, Upload } from "lucide-react";
import { ManagedImage } from "@/components/web/managed-image";

type MedicineRecord = {
  id: string;
  name: string;
  slug: string;
  salts: string;
  category: string | null;
  manufacturer: string | null;
  description: string | null;
  imageUrl: string | null;
  pricePaise: number;
  inStock: boolean;
};

type Props = { initial: MedicineRecord[] };

function emptyForm() {
  return {
    name: "",
    salts: "",
    category: "",
    manufacturer: "",
    description: "",
    imageUrl: "",
    priceRupees: "",
    inStock: true,
  };
}

export function MedicineDashboard({ initial }: Props) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [rows, setRows] = useState<MedicineRecord[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saltSuggestions, setSaltSuggestions] = useState<string[]>([]);
  const [showSaltDropdown, setShowSaltDropdown] = useState(false);

  const editing = useMemo(() => rows.find((r) => r.id === editingId) ?? null, [rows, editingId]);

  function loadRow(m: MedicineRecord) {
    setEditingId(m.id);
    setForm({
      name: m.name,
      salts: m.salts,
      category: m.category ?? "",
      manufacturer: m.manufacturer ?? "",
      description: m.description ?? "",
      imageUrl: m.imageUrl ?? "",
      priceRupees: (m.pricePaise / 100).toFixed(2),
      inStock: m.inStock,
    });
    setSaltSuggestions(getSaltSuggestions());
    setMsg(null);
    setErr(null);
  }

  function clearForm() {
    setEditingId(null);
    setForm(emptyForm());
    setShowSaltDropdown(false);
    setMsg(null);
    setErr(null);
  }

  function handleSaltSelect(salt: string) {
    setForm((f) => ({ ...f, salts: salt }));
    addSaltSuggestion(salt);
    setShowSaltDropdown(false);
  }

  function handleAddSalt() {
    const trimmed = form.salts.trim();
    if (trimmed) {
      addSaltSuggestion(trimmed);
      setSaltSuggestions(getSaltSuggestions());
    }
  }

  async function onCreateOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    const paise = parseRupeesToPaise(form.priceRupees);
    if (paise === null) {
      setErr("Price needs to be a positive number (rupees).");
      return;
    }

    setBusy(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/medicines/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            salts: form.salts,
            category: form.category || null,
            manufacturer: form.manufacturer || null,
            description: form.description || null,
            imageUrl: form.imageUrl || null,
            pricePaise: paise,
            inStock: form.inStock,
          }),
        });
        if (!res.ok) throw new Error("update failed");
        const updated = (await res.json()) as MedicineRecord;
        setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setMsg("Saved changes.");
        router.refresh();
      } else {
        const res = await fetch("/api/admin/medicines", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            salts: form.salts,
            category: form.category || null,
            manufacturer: form.manufacturer || null,
            description: form.description || null,
            imageUrl: form.imageUrl || null,
            pricePaise: paise,
            inStock: form.inStock,
          }),
        });
        if (!res.ok) throw new Error("create failed");
        const created = (await res.json()) as MedicineRecord;
        setRows((prev) => [created, ...prev]);
        clearForm();
        setMsg("Medicine added.");
        router.refresh();
      }
    } catch {
      setErr("Something went wrong — check the form and try again.");
    }
    setBusy(false);
  }

  async function onDelete(id: string) {
    if (!window.confirm("Delete this medicine? It disappears from the public catalog.")) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/medicines/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      setRows((prev) => prev.filter((r) => r.id !== id));
      if (editingId === id) clearForm();
      setMsg("Removed.");
      router.refresh();
    } catch {
      setErr("Could not delete.");
    }
    setBusy(false);
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  // Inline edit handlers
  async function updateField(id: string, field: string, value: unknown) {
    const medicine = rows.find((m) => m.id === id);
    if (!medicine) return;

    setBusy(true);
    try {
      const update: Record<string, unknown> = { [field]: value };
      if (field === "pricePaise") {
        update.pricePaise = value;
      }
      const res = await fetch(`/api/admin/medicines/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      if (!res.ok) throw new Error("update failed");
      const updated = (await res.json()) as MedicineRecord;
      setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      router.refresh();
    } catch {
      setErr("Could not update field.");
    }
    setBusy(false);
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Medicines</h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-400">
            Add medicines with images, set prices & availability. Public /products updates instantly.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onLogout}
          className="border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800"
        >
          Log out
        </Button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <motion.form
          onSubmit={onCreateOrUpdate}
          className="space-y-4 rounded-2xl border-2 border-zinc-700/80 bg-zinc-900/60 p-6 shadow-lg shadow-black/20"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-medium text-white">{editingId ? "Edit medicine" : "New medicine"}</h2>
            {editingId && (
              <Button
                type="button"
                variant="ghost"
                className="text-zinc-400 hover:text-white"
                onClick={clearForm}
                disabled={busy}
              >
                Cancel edit
              </Button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name */}
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-zinc-300">Name *</Label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="border-zinc-700 bg-zinc-950 text-white"
                placeholder="e.g. Imatinib 400mg"
              />
            </div>

            {/* Salts with Dropdown */}
            <div className="space-y-2 sm:col-span-2 relative">
              <Label className="text-zinc-300">Salts / Composition *</Label>
              <div className="relative">
                <Input
                  required
                  value={form.salts}
                  onChange={(e) => setForm((f) => ({ ...f, salts: e.target.value }))}
                  onFocus={() => setShowSaltDropdown(true)}
                  className="border-zinc-700 bg-zinc-950 text-white"
                  placeholder="Type or select from suggestions..."
                />
                {showSaltDropdown && saltSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-950 border border-zinc-700 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                    {saltSuggestions.map((salt) => (
                      <button
                        key={salt}
                        type="button"
                        onClick={() => handleSaltSelect(salt)}
                        className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
                      >
                        {salt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleAddSalt}
                className="text-xs text-teal-400 hover:text-teal-300"
              >
                + Add to suggestions
              </Button>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Category</Label>
              <Input
                list="division-category-options"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="border-zinc-700 bg-zinc-950 text-white"
                placeholder="e.g. Oncology"
              />
              <datalist id="division-category-options">
                {productDivisions.map((d) => (
                  <option key={d.slug} value={d.catalogCategory} />
                ))}
              </datalist>
            </div>

            {/* Manufacturer */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Manufacturer</Label>
              <Input
                value={form.manufacturer}
                onChange={(e) => setForm((f) => ({ ...f, manufacturer: e.target.value }))}
                className="border-zinc-700 bg-zinc-950 text-white"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-zinc-300 flex items-center gap-2">
                <Upload className="size-4" />
                Image URL (optional)
              </Label>
              <Input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                className="border-zinc-700 bg-zinc-950 text-white"
                placeholder="https://example.com/image.jpg or paste image link"
              />
              {form.imageUrl && (
                <div className="relative mt-2 rounded-lg border border-zinc-700 overflow-hidden">
                  <div className="relative h-24 w-full bg-zinc-950">
                    <ManagedImage src={form.imageUrl} alt="Selected medicine image preview" fill className="object-contain" />
                  </div>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Price (₹) *</Label>
              <Input
                required
                inputMode="decimal"
                value={form.priceRupees}
                onChange={(e) => setForm((f) => ({ ...f, priceRupees: e.target.value }))}
                className="border-zinc-700 bg-zinc-950 text-white"
                placeholder="1250.00"
              />
            </div>

            {/* Stock Status */}
            <label className="flex items-center gap-3 pt-7 text-sm text-zinc-300">
              <input
                type="checkbox"
                className="size-4 rounded border-zinc-600 bg-zinc-950"
                checked={form.inStock}
                onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))}
              />
              In stock
            </label>

            {/* Description */}
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-zinc-300">Description (optional)</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="border-zinc-700 bg-zinc-950 text-white"
              />
            </div>
          </div>

          {msg && <p className="text-sm text-teal-400">{msg}</p>}
          {err && <p className="text-sm text-red-400">{err}</p>}

          <Button type="submit" disabled={busy} className="bg-teal-600 text-white hover:bg-teal-500">
            {busy ? "Saving…" : editingId ? "Save changes" : "Add medicine"}
          </Button>
        </motion.form>

        {/* Medicine List */}
        <div className="overflow-hidden rounded-2xl border-2 border-zinc-700/80 shadow-lg shadow-black/20">
          <div className="max-h-[70vh] overflow-auto">
            <div className="grid grid-cols-1 gap-3 p-4">
              {rows.length === 0 ? (
                <p className="text-center py-10 text-zinc-500">Nothing here yet — add your first medicine on the left.</p>
              ) : (
                rows.map((m) => (
                  <motion.div
                    key={m.id}
                    className={cn(
                      "rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3 transition-all hover:bg-zinc-900",
                      editing?.id === m.id && "ring-2 ring-teal-500/50 bg-teal-950/30",
                    )}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={reduce ? undefined : { opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Medicine Image */}
                      {m.imageUrl && (
                        <div className="relative size-16 flex-shrink-0 rounded-lg border border-zinc-700 overflow-hidden bg-zinc-950">
                          <ManagedImage
                            src={m.imageUrl}
                            alt={`${m.name} product thumbnail`}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      )}

                      {/* Medicine Info */}
                      <div className="flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => loadRow(m)}
                          className="font-medium text-zinc-200 hover:text-white text-left line-clamp-1"
                        >
                          {m.name}
                        </button>
                        <p className="text-xs text-zinc-500 line-clamp-1">{m.salts}</p>

                        {/* Inline Edit Controls */}
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          {/* Price Edit */}
                          <input
                            type="text"
                            value={(m.pricePaise / 100).toFixed(2)}
                            onChange={(e) => {
                              const p = parseRupeesToPaise(e.target.value);
                              if (p !== null) updateField(m.id, "pricePaise", p);
                            }}
                            className="w-16 px-2 py-1 rounded bg-zinc-950 border border-zinc-700 text-zinc-300 text-xs"
                            placeholder="Price"
                          />

                          {/* Stock Toggle */}
                          <label className="flex items-center gap-1 text-zinc-400 hover:text-zinc-300">
                            <input
                              type="checkbox"
                              checked={m.inStock}
                              onChange={(e) => updateField(m.id, "inStock", e.target.checked)}
                              className="size-3 rounded"
                            />
                            In stock
                          </label>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:bg-red-950/40 hover:text-red-300 flex-shrink-0"
                        onClick={() => onDelete(m.id)}
                        disabled={busy}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
