"use client";

import { Eye, EyeOff, Mail, Lock, Phone, User, MapPin, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Controller } from "react-hook-form";
import { SignUpFormData } from "@/lib/validation/signUpValidation";
import { countries, Country, getFlagEmoji } from "@/lib/data/countries";

interface SignUpFormProps {
  register: any;
  handleSubmit: any;
  control: any;
  errors: any;
  watch: any;
  setValue: any;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  onSubmit: (data: SignUpFormData) => void;
  isLoading: boolean;
  error: string | null;
  phoneError: string;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCountryCodeChange: (countryCode: string) => void;
  formatPhoneNumber: (phone: string) => string;
  selectedCountryCode: string;
  t: any;
}

export default function SignUpForm({
  register,
  handleSubmit,
  control,
  errors,
  watch,
  setValue,
  showPassword,
  setShowPassword,
  onSubmit,
  isLoading,
  error,
  phoneError,
  handlePhoneChange,
  handleCountryCodeChange,
  formatPhoneNumber,
  selectedCountryCode,
  t,
}: SignUpFormProps) {
  const selectedRole = watch("role");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">{t.nameLabel}</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
          <Input
            id="name"
            type="text"
            placeholder={t.namePlaceholder}
            className="pl-10"
            {...register("name")}
          />
        </div>
        {errors.name && <p className="text-sm text-destructive">{t.errors.nameRequired}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t.emailLabel}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
          <Input
            id="email"
            type="email"
            placeholder={t.emailPlaceholder}
            className="pl-10"
            {...register("email")}
          />
        </div>
        {errors.email && <p className="text-sm text-destructive">{t.errors.emailRequired}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t.passwordLabel}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t.passwordPlaceholder}
            className="pl-10 pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-destructive">{t.errors.passwordRequired}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="number">{t.phoneLabel}</Label>
        <div className="flex gap-2">
          <div className="relative w-32">
            <Controller
              name="countryCode"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleCountryCodeChange(value);
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{country.name}</span>
                          <span className="text-sm text-neutral-500">{country.dialCode}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              id="number"
              type="tel"
              placeholder={t.phonePlaceholder}
              className="pl-10"
              {...register("number")}
              onChange={handlePhoneChange}
              onBlur={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                setValue("number", formatted);
              }}
            />
          </div>
        </div>
        {phoneError && <p className="text-sm text-destructive">{phoneError}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">{t.countryLabel}</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
          <Input
            id="country"
            type="text"
            placeholder={t.countryPlaceholder}
            className="pl-10"
            {...register("country")}
          />
        </div>
        {errors.country && <p className="text-sm text-destructive">{t.errors.countryRequired}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">{t.roleLabel}</Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder={t.rolePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">{t.roles.user}</SelectItem>
                <SelectItem value="admin">{t.roles.admin}</SelectItem>
                <SelectItem value="employee">{t.roles.employee}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && <p className="text-sm text-destructive">{t.errors.roleRequired}</p>}
      </div>

      {(selectedRole === "admin" || selectedRole === "employee") && (
        <div className="space-y-2">
          <Label htmlFor="accessKey">{t.accessKeyLabel}</Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              id="accessKey"
              type="password"
              placeholder={t.accessKeyPlaceholder}
              className="pl-10"
              {...register("accessKey")}
            />
          </div>
          <p className="text-xs text-neutral-500">{t.accessKeyDescription}</p>
          {errors.accessKey && (
            <p className="text-sm text-destructive">{t.errors.accessKeyRequired}</p>
          )}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : t.signUpButton}
      </Button>
    </form>
  );
}
