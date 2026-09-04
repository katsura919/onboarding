"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Camera, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface ProfileField {
    key: string
    label: string
    placeholder?: string
    type?: "text" | "date"
}

const PERSONAL_DETAILS: ProfileField[] = [
    { key: "height", label: "Height", placeholder: "e.g. 5'6\"" },
    { key: "weight", label: "Weight", placeholder: "e.g. 140 lbs" },
]

const APPAREL_SIZING: ProfileField[] = [
    { key: "topSize", label: "Top Size", placeholder: "Add size" },
    { key: "bottomSize", label: "Bottom Size", placeholder: "Add size" },
    {
        key: "jacketSize",
        label: "Jacket / Blazer Size",
        placeholder: "Add size",
    },
    { key: "dressSize", label: "Dress Size", placeholder: "Optional" },
    { key: "shoeSize", label: "Shoe Size", placeholder: "Add size" },
    { key: "beltSize", label: "Belt Size", placeholder: "Add size" },
]

const HAIR: ProfileField[] = [
    {
        key: "hairColor",
        label: "Natural Color",
        placeholder: "Add natural color",
    },
    {
        key: "hairType",
        label: "Hair Type / Texture",
        placeholder: "e.g. straight, wavy, curly",
    },
    {
        key: "hairTreated",
        label: "Treated / Natural",
        placeholder: "e.g. treated, natural, color-treated",
    },
]

const MEASUREMENTS: ProfileField[] = [
    { key: "chest", label: "Chest / Bust", placeholder: "Add measurement" },
    { key: "waist", label: "Waist", placeholder: "Add measurement" },
    { key: "hips", label: "Hips", placeholder: "Add measurement" },
    { key: "thigh", label: "Thigh", placeholder: "Add measurement" },
    { key: "calf", label: "Calf", placeholder: "Add measurement" },
    { key: "ankle", label: "Ankle", placeholder: "Add measurement" },
]

const HEALTH_SNAPSHOT: ProfileField[] = [
    {
        key: "bloodPressure",
        label: "Blood Pressure",
        placeholder: "e.g. 120/80",
    },
    { key: "cholesterol", label: "Cholesterol", placeholder: "Add value" },
    {
        key: "fastingBloodSugar",
        label: "Fasting Blood Sugar",
        placeholder: "Add value",
    },
    {
        key: "lastPhysical",
        label: "Last Physical",
        placeholder: "Add date or year",
    },
]

function initials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
}

function Section({
    label,
    children,
}: {
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="space-y-5 rounded-3xl border border-border/60 bg-card/40 p-6 sm:p-8">
            <span className="inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
                {label}
            </span>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {children}
            </div>
        </div>
    )
}

function FieldInput({
    field,
    value,
    onChange,
}: {
    field: ProfileField
    value: string
    onChange: (value: string) => void
}) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider text-primary uppercase">
                {field.label}
            </label>
            <input
                type={field.type || "text"}
                value={value}
                placeholder={field.placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border-2 border-border/50 bg-background p-3 text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20"
            />
        </div>
    )
}

export default function ProfilePage() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [user, setUser] = useState<{
        firstName: string
        lastName: string
        email: string
    } | null>(null)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [profile, setProfile] = useState<Record<string, string>>({})
    const [dominantHand, setDominantHand] = useState("")
    const [dateUpdated, setDateUpdated] = useState("")
    const [notes, setNotes] = useState("")

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/auth/me")
                if (res.ok) {
                    const data = await res.json()
                    setUser(data.user)
                    setAvatarUrl(data.user.avatarUrl || null)
                    const p = data.user.profile || {}
                    setProfile(p)
                    setDominantHand(p.dominantHand || "")
                    setDateUpdated(p.dateUpdated || "")
                    setNotes(p.notes || "")
                }
            } catch {
                toast.error("Failed to load profile")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    function updateField(key: string, value: string) {
        setProfile((prev) => ({ ...prev, [key]: value }))
    }

    async function handleSave() {
        setIsSaving(true)
        try {
            const data: Record<string, string> = {}
            for (const [key, value] of Object.entries({
                ...profile,
                dominantHand,
                dateUpdated,
                notes,
            })) {
                data[`profile.${key}`] = value
            }

            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data }),
            })

            if (!res.ok) {
                const body = await res.json()
                throw new Error(body.error || "Failed to save")
            }

            toast.success("Profile saved")
        } catch (error: any) {
            toast.error(error.message || "Failed to save profile")
        } finally {
            setIsSaving(false)
        }
    }

    async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        const previewUrl = URL.createObjectURL(file)
        setAvatarUrl(previewUrl)
        setIsUploading(true)

        try {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/profile/avatar", {
                method: "POST",
                body: formData,
            })
            const body = await res.json()

            if (!res.ok) {
                throw new Error(body.error || "Failed to upload image")
            }

            setAvatarUrl(body.avatarUrl)
            toast.success("Photo updated")
        } catch (error: any) {
            toast.error(error.message || "Failed to upload image")
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="animate-pulse text-muted-foreground">
                    Loading your profile...
                </p>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-6xl animate-in space-y-10 p-4 duration-700 fade-in slide-in-from-bottom-4 sm:p-6 lg:px-8 lg:py-12">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    <span className="h-px w-5 bg-border" />
                    Your Profile
                </div>
                <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">
                    Style & Wellness Profile
                </h1>
                <p className="text-xl font-medium text-muted-foreground italic">
                    &ldquo;The details your team needs to take care of you
                    well.&rdquo;
                </p>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-3xl border border-border/60 bg-card/40 p-8 sm:flex-row sm:items-center">
                <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-primary/30">
                        <AvatarImage
                            src={avatarUrl || ""}
                            alt={
                                user
                                    ? `${user.firstName} ${user.lastName}`
                                    : "Profile"
                            }
                        />
                        <AvatarFallback className="bg-primary/5 font-serif text-2xl text-primary">
                            {user
                                ? initials(`${user.firstName} ${user.lastName}`)
                                : "PL"}
                        </AvatarFallback>
                    </Avatar>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute -right-1 -bottom-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105 disabled:opacity-60"
                    >
                        {isUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Camera className="h-4 w-4" />
                        )}
                        <span className="sr-only">Change photo</span>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                    <p className="font-serif text-lg font-medium">
                        {user ? `${user.firstName} ${user.lastName}` : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        JPG, PNG, WEBP, or GIF — up to 5MB.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Section label="Personal Details">
                    {PERSONAL_DETAILS.map((field) => (
                        <FieldInput
                            key={field.key}
                            field={field}
                            value={profile[field.key] || ""}
                            onChange={(v) => updateField(field.key, v)}
                        />
                    ))}
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-primary uppercase">
                            Dominant Hand
                        </label>
                        <select
                            value={dominantHand}
                            onChange={(e) => setDominantHand(e.target.value)}
                            className="w-full rounded-xl border-2 border-border/50 bg-background p-3 text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="">Select</option>
                            <option value="Left">Left</option>
                            <option value="Right">Right</option>
                            <option value="Ambidextrous">Ambidextrous</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-primary uppercase">
                            Date Updated
                        </label>
                        <input
                            type="date"
                            value={dateUpdated}
                            onChange={(e) => setDateUpdated(e.target.value)}
                            className="w-full rounded-xl border-2 border-border/50 bg-background p-3 text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </Section>

                <Section label="Apparel Sizing">
                    {APPAREL_SIZING.map((field) => (
                        <FieldInput
                            key={field.key}
                            field={field}
                            value={profile[field.key] || ""}
                            onChange={(v) => updateField(field.key, v)}
                        />
                    ))}
                </Section>

                <Section label="Hair">
                    {HAIR.map((field) => (
                        <div key={field.key} className="sm:col-span-2">
                            <FieldInput
                                field={field}
                                value={profile[field.key] || ""}
                                onChange={(v) => updateField(field.key, v)}
                            />
                        </div>
                    ))}
                </Section>

                <Section label="Measurements">
                    {MEASUREMENTS.map((field) => (
                        <FieldInput
                            key={field.key}
                            field={field}
                            value={profile[field.key] || ""}
                            onChange={(v) => updateField(field.key, v)}
                        />
                    ))}
                </Section>
            </div>

            <div className="space-y-5 rounded-3xl border border-border/60 bg-card/40 p-6 sm:p-8">
                <span className="inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
                    Health Snapshot
                </span>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {HEALTH_SNAPSHOT.map((field) => (
                        <FieldInput
                            key={field.key}
                            field={field}
                            value={profile[field.key] || ""}
                            onChange={(v) => updateField(field.key, v)}
                        />
                    ))}
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-primary uppercase">
                        Notes
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add personal tracking notes here..."
                        className="min-h-[120px] w-full rounded-xl border-2 border-border/50 bg-background p-3 text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>

            <div className="flex justify-end border-t border-border/60 pt-6">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-11 rounded-xl px-8"
                >
                    {isSaving ? "Saving..." : "Save Profile"}
                </Button>
            </div>
        </div>
    )
}
