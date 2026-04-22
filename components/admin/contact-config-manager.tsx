"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, Pencil, Phone, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ContactConfigRecord } from "@/lib/contact-config";

type Banner = { type: "success" | "error"; text: string } | null;

type ContactManagerProps = {
  contactConfig: ContactConfigRecord | null;
  onUpdate: () => Promise<void>;
};

type ConfigForm = {
  companyName: string;
  businessType: string;
  officeAddress: string;
  officeCity: string;
  officeState: string;
  officeZipCode: string;
  businessHoursStart: string;
  businessHoursEnd: string;
  businessDaysMonFri: boolean;
  businessDaysSat: boolean;
  businessDaysSun: boolean;
};

type PhoneForm = {
  value: string;
  purpose: "sales" | "support" | "procurement" | "emergency";
  description: string;
  isActive: boolean;
  priority: number;
};

type EmailForm = {
  value: string;
  type: "general" | "procurement" | "support" | "sales" | "inquiry_recipient";
  description: string;
  isActive: boolean;
  priority: number;
};

function emptyPhoneForm(): PhoneForm {
  return { value: "", purpose: "sales", description: "", isActive: true, priority: 0 };
}

function emptyEmailForm(): EmailForm {
  return { value: "", type: "general", description: "", isActive: true, priority: 0 };
}

export function ContactConfigManager({ contactConfig, onUpdate }: ContactManagerProps) {
  const [configForm, setConfigForm] = useState<ConfigForm>({
    companyName: "",
    businessType: "",
    officeAddress: "",
    officeCity: "",
    officeState: "",
    officeZipCode: "",
    businessHoursStart: "09:00",
    businessHoursEnd: "18:00",
    businessDaysMonFri: true,
    businessDaysSat: true,
    businessDaysSun: false,
  });
  const [phoneDraft, setPhoneDraft] = useState<PhoneForm>(emptyPhoneForm());
  const [emailDraft, setEmailDraft] = useState<EmailForm>(emptyEmailForm());
  const [editingPhoneId, setEditingPhoneId] = useState<string | null>(null);
  const [editingEmailId, setEditingEmailId] = useState<string | null>(null);
  const [savingConfig, setSavingConfig] = useState(false);
  const [savingPhone, setSavingPhone] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);

  useEffect(() => {
    if (!contactConfig) return;
    setConfigForm({
      companyName: contactConfig.companyName,
      businessType: contactConfig.businessType,
      officeAddress: contactConfig.officeAddress ?? "",
      officeCity: contactConfig.officeCity ?? "",
      officeState: contactConfig.officeState ?? "",
      officeZipCode: contactConfig.officeZipCode ?? "",
      businessHoursStart: contactConfig.businessHoursStart ?? "09:00",
      businessHoursEnd: contactConfig.businessHoursEnd ?? "18:00",
      businessDaysMonFri: contactConfig.businessDaysMonFri,
      businessDaysSat: contactConfig.businessDaysSat,
      businessDaysSun: contactConfig.businessDaysSun,
    });
  }, [contactConfig]);

  async function saveConfig() {
    setSavingConfig(true);
    setBanner(null);
    try {
      const response = await fetch("/api/admin/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configForm),
      });
      if (!response.ok) throw new Error("Could not save contact settings.");
      await onUpdate();
      setBanner({ type: "success", text: "Frontend contact details updated." });
    } catch (error) {
      setBanner({ type: "error", text: error instanceof Error ? error.message : "Could not save contact settings." });
    } finally {
      setSavingConfig(false);
    }
  }

  async function savePhone() {
    setSavingPhone(true);
    setBanner(null);
    try {
      const response = await fetch(editingPhoneId ? `/api/admin/contact/phone/${editingPhoneId}` : "/api/admin/contact/phone", {
        method: editingPhoneId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(phoneDraft),
      });
      if (!response.ok) throw new Error("Could not save phone number.");
      await onUpdate();
      setPhoneDraft(emptyPhoneForm());
      setEditingPhoneId(null);
      setBanner({ type: "success", text: "Phone number updated." });
    } catch (error) {
      setBanner({ type: "error", text: error instanceof Error ? error.message : "Could not save phone number." });
    } finally {
      setSavingPhone(false);
    }
  }

  async function saveEmail() {
    setSavingEmail(true);
    setBanner(null);
    try {
      const response = await fetch(editingEmailId ? `/api/admin/contact/email/${editingEmailId}` : "/api/admin/contact/email", {
        method: editingEmailId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailDraft),
      });
      if (!response.ok) throw new Error("Could not save email address.");
      await onUpdate();
      setEmailDraft(emptyEmailForm());
      setEditingEmailId(null);
      setBanner({ type: "success", text: "Email address updated." });
    } catch (error) {
      setBanner({ type: "error", text: error instanceof Error ? error.message : "Could not save email address." });
    } finally {
      setSavingEmail(false);
    }
  }

  async function removePhone(id: string) {
    setSavingPhone(true);
    setBanner(null);
    try {
      const response = await fetch(`/api/admin/contact/phone/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete phone number.");
      await onUpdate();
      if (editingPhoneId === id) {
        setEditingPhoneId(null);
        setPhoneDraft(emptyPhoneForm());
      }
      setBanner({ type: "success", text: "Phone number deleted." });
    } catch (error) {
      setBanner({ type: "error", text: error instanceof Error ? error.message : "Could not delete phone number." });
    } finally {
      setSavingPhone(false);
    }
  }

  async function removeEmail(id: string) {
    setSavingEmail(true);
    setBanner(null);
    try {
      const response = await fetch(`/api/admin/contact/email/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete email address.");
      await onUpdate();
      if (editingEmailId === id) {
        setEditingEmailId(null);
        setEmailDraft(emptyEmailForm());
      }
      setBanner({ type: "success", text: "Email address deleted." });
    } catch (error) {
      setBanner({ type: "error", text: error instanceof Error ? error.message : "Could not delete email address." });
    } finally {
      setSavingEmail(false);
    }
  }

  return (
    <div className="space-y-6">
      {banner ? (
        <div className={`rounded-lg border px-4 py-3 text-sm ${banner.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {banner.text}
        </div>
      ) : null}

      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Frontend Contact Details</CardTitle>
          <CardDescription>These values appear on the contact page, footer, floating widget, and quote flow.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input value={configForm.companyName} onChange={(event) => setConfigForm((current) => ({ ...current, companyName: event.target.value }))} placeholder="Company name" />
            <Input value={configForm.businessType} onChange={(event) => setConfigForm((current) => ({ ...current, businessType: event.target.value }))} placeholder="Business type" />
            <Input value={configForm.officeAddress} onChange={(event) => setConfigForm((current) => ({ ...current, officeAddress: event.target.value }))} placeholder="Office address" className="md:col-span-2" />
            <Input value={configForm.officeCity} onChange={(event) => setConfigForm((current) => ({ ...current, officeCity: event.target.value }))} placeholder="City" />
            <Input value={configForm.officeState} onChange={(event) => setConfigForm((current) => ({ ...current, officeState: event.target.value }))} placeholder="State" />
            <Input value={configForm.officeZipCode} onChange={(event) => setConfigForm((current) => ({ ...current, officeZipCode: event.target.value }))} placeholder="ZIP code" />
            <Input type="time" value={configForm.businessHoursStart} onChange={(event) => setConfigForm((current) => ({ ...current, businessHoursStart: event.target.value }))} />
            <Input type="time" value={configForm.businessHoursEnd} onChange={(event) => setConfigForm((current) => ({ ...current, businessHoursEnd: event.target.value }))} />
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={configForm.businessDaysMonFri} onChange={(event) => setConfigForm((current) => ({ ...current, businessDaysMonFri: event.target.checked }))} />Mon-Fri</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={configForm.businessDaysSat} onChange={(event) => setConfigForm((current) => ({ ...current, businessDaysSat: event.target.checked }))} />Sat</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={configForm.businessDaysSun} onChange={(event) => setConfigForm((current) => ({ ...current, businessDaysSun: event.target.checked }))} />Sun</label>
          </div>
          <Button type="button" className="bg-[#0D7377] text-white hover:bg-[#0b6669]" onClick={saveConfig} disabled={savingConfig}>
            {savingConfig ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Contact Settings
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Phone className="h-4 w-4" />Phone Numbers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Input value={phoneDraft.value} onChange={(event) => setPhoneDraft((current) => ({ ...current, value: event.target.value }))} placeholder="+91 XXXXX XXXXX" />
              <div className="grid gap-3 md:grid-cols-3">
                <select value={phoneDraft.purpose} onChange={(event) => setPhoneDraft((current) => ({ ...current, purpose: event.target.value as PhoneForm["purpose"] }))} className="h-10 rounded-md border border-gray-300 px-3 text-sm">
                  <option value="sales">Sales</option>
                  <option value="support">Support</option>
                  <option value="procurement">Procurement</option>
                  <option value="emergency">Emergency</option>
                </select>
                <Input value={phoneDraft.description} onChange={(event) => setPhoneDraft((current) => ({ ...current, description: event.target.value }))} placeholder="Description" />
                <Input type="number" value={String(phoneDraft.priority)} onChange={(event) => setPhoneDraft((current) => ({ ...current, priority: Number.parseInt(event.target.value || "0", 10) }))} placeholder="Priority" />
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={phoneDraft.isActive} onChange={(event) => setPhoneDraft((current) => ({ ...current, isActive: event.target.checked }))} />Active</label>
              <div className="flex flex-wrap gap-2">
                <Button type="button" className="bg-[#0D7377] text-white hover:bg-[#0b6669]" onClick={savePhone} disabled={savingPhone}>
                  {savingPhone ? <Loader2 className="h-4 w-4 animate-spin" /> : editingPhoneId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {editingPhoneId ? "Update Phone" : "Add Phone"}
                </Button>
                {editingPhoneId ? <Button type="button" variant="outline" className="border-gray-300" onClick={() => { setEditingPhoneId(null); setPhoneDraft(emptyPhoneForm()); }}>Cancel</Button> : null}
              </div>
            </div>
            <div className="space-y-3">
              {contactConfig?.phones.map((phone) => (
                <div key={phone.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{phone.value}</p>
                      <p className="text-sm text-gray-500">{phone.purpose} · priority {phone.priority}</p>
                      {phone.description ? <p className="mt-1 text-sm text-gray-600">{phone.description}</p> : null}
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="border-gray-300" onClick={() => { setEditingPhoneId(phone.id); setPhoneDraft({ value: phone.value, purpose: phone.purpose as PhoneForm["purpose"], description: phone.description ?? "", isActive: phone.isActive, priority: phone.priority }); }}><Pencil className="h-4 w-4" /></Button>
                      <Button type="button" variant="outline" className="border-gray-300" onClick={() => void removePhone(phone.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mail className="h-4 w-4" />Email Addresses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Input type="email" value={emailDraft.value} onChange={(event) => setEmailDraft((current) => ({ ...current, value: event.target.value }))} placeholder="contact@example.com" />
              <div className="grid gap-3 md:grid-cols-3">
                <select value={emailDraft.type} onChange={(event) => setEmailDraft((current) => ({ ...current, type: event.target.value as EmailForm["type"] }))} className="h-10 rounded-md border border-gray-300 px-3 text-sm">
                  <option value="general">General</option>
                  <option value="procurement">Procurement</option>
                  <option value="support">Support</option>
                  <option value="sales">Sales</option>
                  <option value="inquiry_recipient">Inquiry Recipient</option>
                </select>
                <Input value={emailDraft.description} onChange={(event) => setEmailDraft((current) => ({ ...current, description: event.target.value }))} placeholder="Description" />
                <Input type="number" value={String(emailDraft.priority)} onChange={(event) => setEmailDraft((current) => ({ ...current, priority: Number.parseInt(event.target.value || "0", 10) }))} placeholder="Priority" />
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={emailDraft.isActive} onChange={(event) => setEmailDraft((current) => ({ ...current, isActive: event.target.checked }))} />Active</label>
              <div className="flex flex-wrap gap-2">
                <Button type="button" className="bg-[#0D7377] text-white hover:bg-[#0b6669]" onClick={saveEmail} disabled={savingEmail}>
                  {savingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : editingEmailId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {editingEmailId ? "Update Email" : "Add Email"}
                </Button>
                {editingEmailId ? <Button type="button" variant="outline" className="border-gray-300" onClick={() => { setEditingEmailId(null); setEmailDraft(emptyEmailForm()); }}>Cancel</Button> : null}
              </div>
            </div>
            <div className="space-y-3">
              {contactConfig?.emails.map((email) => (
                <div key={email.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{email.value}</p>
                      <p className="text-sm text-gray-500">{email.type} · priority {email.priority}</p>
                      {email.description ? <p className="mt-1 text-sm text-gray-600">{email.description}</p> : null}
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="border-gray-300" onClick={() => { setEditingEmailId(email.id); setEmailDraft({ value: email.value, type: email.type as EmailForm["type"], description: email.description ?? "", isActive: email.isActive, priority: email.priority }); }}><Pencil className="h-4 w-4" /></Button>
                      <Button type="button" variant="outline" className="border-gray-300" onClick={() => void removeEmail(email.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
