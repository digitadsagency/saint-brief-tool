"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

export function Question({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-base font-medium">
          {label}
          {required ? " *" : ""}
        </Label>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

export function OptionCards({
  options,
  value,
  values,
  onChange,
  multiple,
  max,
}: {
  options: string[]
  value?: string
  values?: string[]
  onChange: (next: string | string[]) => void
  multiple?: boolean
  max?: number
}) {
  const selected = multiple ? values || [] : value ? [value] : []

  const toggle = (option: string) => {
    if (!multiple) {
      onChange(option)
      return
    }
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option))
      return
    }
    if (max && selected.length >= max) return
    onChange([...selected, option])
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {options.map((option) => {
        const isOn = selected.includes(option)
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`p-3 border-2 rounded-lg text-left transition-all ${
              isOn ? "border-[#C1FFDD] bg-[#C1FFDD]/20" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 border-2 rounded ${
                  isOn ? "bg-[#C1FFDD] border-[#C1FFDD]" : "border-gray-300"
                }`}
              />
              <span className="text-sm font-medium">{option}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export function ChipList({
  items,
  onAdd,
  onRemove,
  placeholder,
}: {
  items: string[]
  onAdd: (value: string) => void
  onRemove: (value: string) => void
  placeholder: string
}) {
  const [draft, setDraft] = React.useState("")

  const add = () => {
    const value = draft.trim()
    if (!value || items.includes(value)) return
    onAdd(value)
    setDraft("")
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              add()
            }
          }}
        />
        <Button type="button" size="icon" onClick={add}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} variant="secondary" className="flex items-center gap-1">
            {item}
            <X className="h-3 w-3 cursor-pointer" onClick={() => onRemove(item)} />
          </Badge>
        ))}
      </div>
    </div>
  )
}

export function StepNav({
  onBack,
  onNext,
  nextLabel = "Siguiente",
  hideBack,
  submitting,
}: {
  onBack: () => void
  onNext: () => void
  nextLabel?: string
  hideBack?: boolean
  submitting?: boolean
}) {
  return (
    <div className="flex justify-between pt-6">
      {hideBack ? (
        <div />
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-[#CADCFF] text-black hover:bg-[#CADCFF] hover:text-black"
        >
          Atrás
        </Button>
      )}
      <Button
        type="button"
        onClick={onNext}
        disabled={submitting}
        className="bg-black text-white hover:bg-gray-800"
      >
        {submitting ? "Enviando..." : nextLabel}
      </Button>
    </div>
  )
}

export function FieldInput(props: React.ComponentProps<typeof Input>) {
  return <Input className="w-full" {...props} />
}

export function FieldTextarea(props: React.ComponentProps<typeof Textarea>) {
  return <Textarea className="w-full" rows={props.rows ?? 3} {...props} />
}
