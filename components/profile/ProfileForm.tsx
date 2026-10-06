"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { saveProfileAction } from "@/actions/profile";
import { useToast } from "@/components/ui/Toast";
import type { ProfileData, WorkExperienceItem } from "@/types/profile";
import { createInitialProfileData } from "@/lib/profile-utils";

import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { ProfessionalInfoSection } from "./sections/ProfessionalInfoSection";
import { WorkExperienceSection } from "./sections/WorkExperienceSection";
import { EducationSection } from "./sections/EducationSection";
import { JobPreferencesSection } from "./sections/JobPreferencesSection";

export type { ProfileData };

type Props = {
  initialData?: Partial<ProfileData>;
  formData?: ProfileData;
  setFormData?: React.Dispatch<React.SetStateAction<ProfileData>>;
  onSave?: (data: ProfileData) => Promise<void> | void;
  className?: string;
};

export function ProfileForm({
  initialData = {},
  formData: externalFormData,
  setFormData: externalSetFormData,
  onSave,
  className = "",
}: Props) {
  const [internalFormData, setInternalFormData] = useState<ProfileData>(() =>
    createInitialProfileData(initialData)
  );

  const formData = externalFormData ?? internalFormData;
  const setFormData = externalSetFormData ?? setInternalFormData;

  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFieldChange = <K extends keyof ProfileData>(
    field: K,
    value: ProfileData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
      toast({
        type: "info",
        title: "Skill added",
        message: `"${skill}" added to your skills.`,
        duration: 2500,
      });
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
    toast({
      type: "info",
      title: "Skill removed",
      message: `"${skill}" removed from your skills.`,
      duration: 2500,
    });
  };

  const handleAddIndustry = (industry: string) => {
    if (!formData.industries.includes(industry)) {
      setFormData((prev) => ({
        ...prev,
        industries: [...prev.industries, industry],
      }));
      toast({
        type: "info",
        title: "Industry added",
        message: `"${industry}" added to industries.`,
        duration: 2500,
      });
    }
  };

  const handleRemoveIndustry = (industry: string) => {
    setFormData((prev) => ({
      ...prev,
      industries: prev.industries.filter((i) => i !== industry),
    }));
    toast({
      type: "info",
      title: "Industry removed",
      message: `"${industry}" removed from industries.`,
      duration: 2500,
    });
  };

  const handleAddRole = () => {
    if (formData.workExperience.length >= 3) return;
    const newRole: WorkExperienceItem = {
      id: String(Date.now()),
      company: "",
      title: "",
      startDate: "",
      endDate: "",
      current: false,
      responsibilities: "",
    };
    setFormData((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, newRole],
    }));
    toast({
      type: "info",
      title: "Role added",
      message: "New role entry added to work experience.",
      duration: 2500,
    });
  };

  const handleRoleChange = (
    id: string,
    field: "company" | "title" | "startDate" | "endDate" | "current" | "responsibilities",
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((role) =>
        role.id === id ? { ...role, [field]: value } : role
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    setErrorMessage(null);

    toast({
      type: "info",
      title: "Saving profile",
      message: "Saving your details to InsForge...",
      duration: 2000,
    });

    try {
      if (onSave) {
        await onSave(formData);
        setSavedSuccess(true);
        toast({
          type: "success",
          title: "Profile saved",
          message: "Your profile information has been updated successfully.",
        });
      } else {
        const result = await saveProfileAction(formData);
        if (!result.success) {
          const errText = result.error || "Failed to save profile";
          setErrorMessage(errText);
          toast({
            type: "error",
            title: "Save failed",
            message: errText,
          });
        } else {
          setSavedSuccess(true);
          toast({
            type: "success",
            title: "Profile saved",
            message: "Your profile information has been updated successfully.",
          });
        }
      }
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error("[ProfileForm/handleSubmit]", err);
      const fallbackError =
        "An unexpected error occurred while saving your profile";
      setErrorMessage(fallbackError);
      toast({
        type: "error",
        title: "Save error",
        message: fallbackError,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-base font-semibold text-text-primary">
          Profile Information
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          This context is used to accurately represent you in agent interactions.
        </p>
      </div>

      {savedSuccess && (
        <div className="mb-6 p-3 rounded-lg border border-success/30 bg-success-lightest text-success-foreground text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
          <span>Profile information updated and saved successfully!</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-3 rounded-lg border border-error/30 bg-error/10 text-error text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-error shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <PersonalInfoSection
        formData={formData}
        onChange={handleFieldChange}
      />

      <ProfessionalInfoSection
        formData={formData}
        onChange={handleFieldChange}
        onAddSkill={handleAddSkill}
        onRemoveSkill={handleRemoveSkill}
        onAddIndustry={handleAddIndustry}
        onRemoveIndustry={handleRemoveIndustry}
      />

      <WorkExperienceSection
        roles={formData.workExperience}
        onAddRole={handleAddRole}
        onRoleChange={handleRoleChange}
      />

      <EducationSection
        formData={formData}
        onChange={handleFieldChange}
      />

      <JobPreferencesSection
        formData={formData}
        onChange={handleFieldChange}
      />

      <div className="pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-accent hover:bg-accent-dark text-accent-foreground font-medium text-sm py-3 rounded-xl transition-colors shadow-xs disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
