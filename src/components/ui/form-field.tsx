
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea';
  value: string | number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required,
  placeholder,
  disabled,
  className
}: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const inputProps = {
    id: name,
    name,
    value: value.toString(),
    onChange: handleChange,
    onBlur,
    placeholder,
    disabled,
    className: cn(
      error && "border-red-500 focus:border-red-500",
      className
    )
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={cn(required && "after:content-['*'] after:text-red-500 after:ml-1")}>
        {label}
      </Label>
      {type === 'textarea' ? (
        <Textarea {...inputProps} rows={3} />
      ) : (
        <Input {...inputProps} type={type} />
      )}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span className="text-red-500">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}
