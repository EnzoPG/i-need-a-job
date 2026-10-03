"use client";

import { useState } from "react";
import { Plus, X, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { saveProfileAction } from "@/actions/profile";
import { useToast } from "@/components/ui/Toast";

export type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  portfolioUrl: string;
  workAuthorization: string;
  currentTitle: string;
  experienceLevel: string;
  yearsExperience: string;
  skills: string[];
  industries: string[];
  workExperience: Array<{
    id: string;
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    current: boolean;
    responsibilities: string;
  }>;
  highestDegree: string;
  fieldOfStudy: string;
  institutionName: string;
  graduationYear: string;
  jobTitlesSeeking: string;
  remotePreference: string;
  salaryExpectation: string;
  preferredLocations: string;
};

type Props = {
  initialData?: Partial<ProfileData>;
  onSave?: (data: ProfileData) => Promise<void> | void;
  className?: string;
};

export function ProfileForm({ initialData = {}, onSave, className = "" }: Props) {
  const [formData, setFormData] = useState<ProfileData>({
    fullName: initialData.fullName ?? "Faizan Ali",
    email: initialData.email ?? "",
    phone: initialData.phone ?? "+1 (555) 000-0000",
    location: initialData.location ?? "",
    linkedinUrl: initialData.linkedinUrl ?? "https://linkedin.com/in/faizan",
    portfolioUrl: initialData.portfolioUrl ?? "https://github.com/jsmastery",
    workAuthorization: initialData.workAuthorization ?? "Citizen",
    currentTitle: initialData.currentTitle ?? "Frontend Engineer",
    experienceLevel: initialData.experienceLevel ?? "Junior",
    yearsExperience: initialData.yearsExperience !== undefined ? String(initialData.yearsExperience) : "4",
    skills: initialData.skills && initialData.skills.length > 0
      ? initialData.skills
      : ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    industries: initialData.industries ?? [],
    workExperience: initialData.workExperience && initialData.workExperience.length > 0
      ? initialData.workExperience
      : [
          {
            id: "1",
            company: "Vercel",
            title: "Frontend Engineer",
            startDate: "January 2022",
            endDate: "--------- ----",
            current: true,
            responsibilities:
              "Built Next.js features and optimized web vitals. Led a team of 3 developers.",
          },
        ],
    highestDegree: initialData.highestDegree ?? "High School",
    fieldOfStudy: initialData.fieldOfStudy ?? "Computer Science",
    institutionName: initialData.institutionName ?? "",
    graduationYear: initialData.graduationYear ?? "",
    jobTitlesSeeking: initialData.jobTitlesSeeking ?? "Frontend Engineer, React Developer",
    remotePreference: initialData.remotePreference ?? "Any",
    salaryExpectation: initialData.salaryExpectation ?? "",
    preferredLocations: initialData.preferredLocations ?? "",
  });

  const { toast } = useToast();
  const [skillInput, setSkillInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setSkillInput("");
      toast({
        type: "info",
        title: "Skill added",
        message: `"${trimmed}" added to your skills.`,
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

  const handleAddIndustry = () => {
    const trimmed = industryInput.trim();
    if (trimmed && !formData.industries.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, industries: [...prev.industries, trimmed] }));
      setIndustryInput("");
      toast({
        type: "info",
        title: "Industry added",
        message: `"${trimmed}" added to industries.`,
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
    setFormData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          id: String(Date.now()),
          company: "",
          title: "",
          startDate: "",
          endDate: "",
          current: false,
          responsibilities: "",
        },
      ],
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
      const fallbackError = "An unexpected error occurred while saving your profile";
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
    <form onSubmit={handleSubmit} className={`bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs ${className}`}>
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

      {/* 1. Personal Info */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          Personal Info
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2 text-sm text-text-secondary cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, Country"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Portfolio / GitHub
            </label>
            <input
              type="url"
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              placeholder="https://github.com/username"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Work Authorization
            </label>
            <select
              value={formData.workAuthorization}
              onChange={(e) => setFormData({ ...formData, workAuthorization: e.target.value })}
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            >
              <option value="Citizen">Citizen</option>
              <option value="Permanent Resident">Permanent Resident</option>
              <option value="Visa Required">Visa Required</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Professional Info */}
      <div className="mb-8 pt-6 border-t border-border">
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          Professional Info
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Current/Recent Job Title
            </label>
            <input
              type="text"
              value={formData.currentTitle}
              onChange={(e) => setFormData({ ...formData, currentTitle: e.target.value })}
              placeholder="Frontend Engineer"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
                Experience Level
              </label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
              >
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                value={formData.yearsExperience}
                onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Skills Input & Tags */}
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Skills
            </label>
            <div className="flex gap-2 mb-2.5">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add a skill"
                className="flex-1 bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-surface hover:bg-surface-secondary border border-border text-text-primary text-xs font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-surface-secondary border border-border text-text-primary text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Industries Worked In */}
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Industries Worked In (Optional)
            </label>
            <div className="flex gap-2 mb-2.5">
              <input
                type="text"
                value={industryInput}
                onChange={(e) => setIndustryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddIndustry();
                  }
                }}
                placeholder="E.g. FinTech, Healthcare"
                className="flex-1 bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
              />
              <button
                type="button"
                onClick={handleAddIndustry}
                className="bg-surface hover:bg-surface-secondary border border-border text-text-primary text-xs font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>

            {formData.industries.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.industries.map((industry) => (
                  <span
                    key={industry}
                    className="bg-surface-secondary border border-border text-text-primary text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs"
                  >
                    {industry}
                    <button
                      type="button"
                      onClick={() => handleRemoveIndustry(industry)}
                      className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                      aria-label={`Remove ${industry}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Work Experience */}
      <div className="mb-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Work Experience
          </h3>
          {formData.workExperience.length < 3 && (
            <button
              type="button"
              onClick={handleAddRole}
              className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add role</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          {formData.workExperience.map((role) => (
            <div
              key={role.id}
              className="border border-border rounded-xl p-5 sm:p-6 bg-surface space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={role.company}
                    onChange={(e) => handleRoleChange(role.id, "company", e.target.value)}
                    placeholder="Company Name"
                    className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={role.title}
                    onChange={(e) => handleRoleChange(role.id, "title", e.target.value)}
                    placeholder="Job Title"
                    className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={role.startDate}
                      onChange={(e) => handleRoleChange(role.id, "startDate", e.target.value)}
                      placeholder="January 2022"
                      className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors pr-10"
                    />
                    <Calendar className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase">
                      End Date
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={role.current}
                        onChange={(e) => {
                          const isCurrent = e.target.checked;
                          handleRoleChange(role.id, "current", isCurrent);
                          if (isCurrent) {
                            handleRoleChange(role.id, "endDate", "--------- ----");
                          }
                        }}
                        className="rounded border-border text-accent focus:ring-accent"
                      />
                      <span>Currently working here</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={role.endDate}
                    disabled={role.current}
                    onChange={(e) => handleRoleChange(role.id, "endDate", e.target.value)}
                    placeholder="MM/YYYY or Present"
                    className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary disabled:bg-surface-secondary disabled:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
                  Key Responsibilities
                </label>
                <textarea
                  rows={3}
                  value={role.responsibilities}
                  onChange={(e) => handleRoleChange(role.id, "responsibilities", e.target.value)}
                  placeholder="Built Next.js features and optimized web vitals. Led a team of 3 developers."
                  className="w-full bg-surface border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors resize-y"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Education */}
      <div className="mb-8 pt-6 border-t border-border">
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          Education
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Highest Degree
            </label>
            <select
              value={formData.highestDegree}
              onChange={(e) => setFormData({ ...formData, highestDegree: e.target.value })}
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            >
              <option value="High School">High School</option>
              <option value="Associate">Associate Degree</option>
              <option value="Bachelor's">Bachelor&apos;s</option>
              <option value="Master's">Master&apos;s</option>
              <option value="Doctorate">Doctorate</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Field of Study
            </label>
            <input
              type="text"
              value={formData.fieldOfStudy}
              onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
              placeholder="Computer Science"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Institution Name
            </label>
            <input
              type="text"
              value={formData.institutionName}
              onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
              placeholder="E.g. State University"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Graduation Year
            </label>
            <input
              type="text"
              value={formData.graduationYear}
              onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
              placeholder="YYYY"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 5. Job Preferences */}
      <div className="mb-8 pt-6 border-t border-border">
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          Job Preferences
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Job Titles Seeking
            </label>
            <input
              type="text"
              value={formData.jobTitlesSeeking}
              onChange={(e) => setFormData({ ...formData, jobTitlesSeeking: e.target.value })}
              placeholder="Frontend Engineer, React Developer"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
                Remote Preference
              </label>
              <select
                value={formData.remotePreference}
                onChange={(e) => setFormData({ ...formData, remotePreference: e.target.value })}
                className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
              >
                <option value="Any">Any</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
                Salary Expectation (Optional)
              </label>
              <input
                type="text"
                value={formData.salaryExpectation}
                onChange={(e) => setFormData({ ...formData, salaryExpectation: e.target.value })}
                placeholder="E.g. $120k+"
                className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Preferred Locations (Optional)
            </label>
            <input
              type="text"
              value={formData.preferredLocations}
              onChange={(e) => setFormData({ ...formData, preferredLocations: e.target.value })}
              placeholder="E.g. New York, London"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
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
