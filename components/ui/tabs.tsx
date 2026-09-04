"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Tabs({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            className={cn(
                // Vertical orientation is a left rail from sm: up; below that
                // (no room for a 224px rail) it collapses to the same
                // horizontal-pill layout as the default orientation.
                "flex min-w-0 flex-col gap-6 sm:data-[orientation=vertical]:flex-row sm:data-[orientation=vertical]:items-start sm:data-[orientation=vertical]:gap-8",
                className
            )}
            {...props}
        />
    )
}

function TabsList({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            className={cn(
                "inline-flex w-fit items-center gap-1 overflow-x-auto rounded-full border border-border/60 bg-card/40 p-1",
                "sm:data-[orientation=vertical]:sticky sm:data-[orientation=vertical]:top-24 sm:data-[orientation=vertical]:w-56 sm:data-[orientation=vertical]:shrink-0 sm:data-[orientation=vertical]:flex-col sm:data-[orientation=vertical]:items-stretch sm:data-[orientation=vertical]:gap-1 sm:data-[orientation=vertical]:overflow-visible sm:data-[orientation=vertical]:rounded-3xl sm:data-[orientation=vertical]:p-2",
                className
            )}
            {...props}
        />
    )
}

function TabsTrigger({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "sm:data-[orientation=vertical]:justify-start sm:data-[orientation=vertical]:rounded-2xl sm:data-[orientation=vertical]:px-4 sm:data-[orientation=vertical]:py-2.5 sm:data-[orientation=vertical]:text-left",
                className
            )}
            {...props}
        />
    )
}

function TabsContent({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn("min-w-0 flex-1 outline-none", className)}
            {...props}
        />
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
