'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type MoleculePayload = {
  name: string;
  slug: string;
  synonyms: string;
  imageUrl: string;
  isPublished: boolean;
  overview: string;
  backgroundAndApproval: string;
  uses: string;
  administration: string;
  sideEffects: string;
  warnings: string;
  precautions: string;
  expertTips: string;
  faqs: string;
  references: string;
};

interface MoleculeFormProps {
  moleculeId?: string;
  onSave: (data: MoleculePayload) => Promise<void>;
  onCancel: () => void;
}

export function MoleculeForm({ moleculeId, onSave, onCancel }: MoleculeFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<MoleculePayload>({
    name: '',
    slug: '',
    synonyms: '',
    imageUrl: '',
    isPublished: true,
    overview: '',
    backgroundAndApproval: '',
    uses: '',
    administration: '',
    sideEffects: '',
    warnings: '',
    precautions: '',
    expertTips: '',
    faqs: '',
    references: '',
  });

  useEffect(() => {
    if (!moleculeId) return;

    void (async () => {
      try {
        const res = await fetch(`/api/admin/molecules/${moleculeId}`);
        if (!res.ok) return;

        const molecule = (await res.json()) as Partial<MoleculePayload>;
        setFormData((current) => ({
          ...current,
          ...molecule,
          name: molecule.name ?? current.name,
          slug: molecule.slug ?? current.slug,
          synonyms: molecule.synonyms ?? "",
          imageUrl: molecule.imageUrl ?? "",
          isPublished: molecule.isPublished ?? current.isPublished,
          overview: molecule.overview ?? "",
          backgroundAndApproval: molecule.backgroundAndApproval ?? "",
          uses: molecule.uses ?? "",
          administration: molecule.administration ?? "",
          sideEffects: molecule.sideEffects ?? "",
          warnings: molecule.warnings ?? "",
          precautions: molecule.precautions ?? "",
          expertTips: molecule.expertTips ?? "",
          faqs: molecule.faqs ?? "",
          references: molecule.references ?? "",
        }));
      } catch {}
    })();
  }, [moleculeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = e.target instanceof HTMLInputElement ? e.target.checked : false;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <fieldset className="border p-4 rounded-lg space-y-4">
        <legend className="font-bold">Basic Info</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
            <p className="text-xs text-gray-600 mt-1">Auto-filled from name, can be customized</p>
          </div>
        </div>
        <div>
          <Label htmlFor="synonyms">Synonyms</Label>
          <Input
            id="synonyms"
            name="synonyms"
            value={formData.synonyms}
            onChange={handleChange}
            placeholder="Comma-separated alternative names"
          />
        </div>
        <div>
          <Label htmlFor="imageUrl">Image</Label>
          <Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} />
        </div>
        <Label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
          />
          Is Published
        </Label>
      </fieldset>

      {/* Content */}
      <fieldset className="border p-4 rounded-lg space-y-4">
        <legend className="font-bold">Content</legend>
        <div>
          <Label htmlFor="overview">Overview</Label>
          <Textarea id="overview" name="overview" value={formData.overview} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="backgroundAndApproval">Background and Approval</Label>
          <Textarea id="backgroundAndApproval" name="backgroundAndApproval" value={formData.backgroundAndApproval} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="uses">Uses</Label>
          <Textarea id="uses" name="uses" value={formData.uses} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="administration">Administration</Label>
          <Textarea id="administration" name="administration" value={formData.administration} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="sideEffects">Side Effects</Label>
          <Textarea id="sideEffects" name="sideEffects" value={formData.sideEffects} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="warnings">Warnings</Label>
          <Textarea id="warnings" name="warnings" value={formData.warnings} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="precautions">Precautions</Label>
          <Textarea id="precautions" name="precautions" value={formData.precautions} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="expertTips">Expert Tips</Label>
          <Textarea id="expertTips" name="expertTips" value={formData.expertTips} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="faqs">FAQs</Label>
          <Textarea id="faqs" name="faqs" value={formData.faqs} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="references">References</Label>
          <Textarea id="references" name="references" value={formData.references} onChange={handleChange} />
        </div>
      </fieldset>

      {/* Timestamps */}
      <div className="border p-4 rounded-lg">
        <p className="text-sm text-gray-600">Created at: {moleculeId ? new Date().toLocaleString() : 'N/A'}</p>
      </div>

      {/* Form Actions */}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
