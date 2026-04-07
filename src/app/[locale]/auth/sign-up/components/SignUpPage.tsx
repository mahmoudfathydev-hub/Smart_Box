'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signUpTranslations } from '@/dict/auth/SignUp';
import { Eye, EyeOff, Mail, Lock, Phone, User, MapPin, Image, Key } from 'lucide-react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/lib/hooks/useAuth';
import { signUpSchema, SignUpFormData } from '@/lib/validation/authValidation';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SignUpPage() {
  const params = useParams();
  const locale = (params.locale as 'en' | 'ar') || 'en';
  const t = signUpTranslations[locale];
  const router = useRouter();
  const { signUp, isLoading, error, isAuthenticated, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: 'user',
    },
  });

  const selectedRole = watch('role');

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    if (user.role === 'admin' || user.role === 'employee') {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  }

  const validatePhone = (phone: string) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(phone);
      if (phoneNumber && phoneNumber.isValid()) {
        setPhoneError('');
        return true;
      } else {
        setPhoneError('Please enter a valid phone number');
        return false;
      }
    } catch (err) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
  };

  const formatPhoneNumber = (phone: string) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(phone);
      if (phoneNumber) {
        return phoneNumber.formatInternational();
      }
    } catch (err) {
      return phone;
    }
    return phone;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue('phone', value);

    if (value) {
      validatePhone(value);
    } else {
      setPhoneError('');
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    try {
      // Validate phone number before submission
      if (!validatePhone(data.phone)) {
        return;
      }

      const result = await signUp({
        ...data,
        number: data.phone, // Map phone to number for the API
      });

      if (result.meta.requestStatus === 'fulfilled') {
        // Redirect will be handled by the useEffect above
        if (user?.role === 'admin' || user?.role === 'employee') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch (err) {
      // Error is handled by the auth slice
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
            <CardDescription>{t.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
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
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">{t.errors.nameRequired}</p>
                )}
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
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{t.errors.emailRequired}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t.passwordLabel}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t.passwordPlaceholder}
                    className="pl-10 pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{t.errors.passwordRequired}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t.phoneLabel}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t.phonePlaceholder}
                    className="pl-10"
                    {...register('phone')}
                    onChange={handlePhoneChange}
                    onBlur={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      setValue('phone', formatted);
                    }}
                  />
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
                    {...register('country')}
                  />
                </div>
                {errors.country && (
                  <p className="text-sm text-destructive">{t.errors.countryRequired}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">{t.roleLabel}</Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                {errors.role && (
                  <p className="text-sm text-destructive">{t.errors.roleRequired}</p>
                )}
              </div>

              {(selectedRole === 'admin' || selectedRole === 'employee') && (
                <div className="space-y-2">
                  <Label htmlFor="accessKey">{t.accessKeyLabel}</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                    <Input
                      id="accessKey"
                      type="password"
                      placeholder={t.accessKeyPlaceholder}
                      className="pl-10"
                      {...register('accessKey')}
                    />
                  </div>
                  <p className="text-xs text-neutral-500">{t.accessKeyDescription}</p>
                  {errors.accessKey && (
                    <p className="text-sm text-destructive">{t.errors.accessKeyRequired}</p>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : t.signUpButton}
              </Button>

              <div className="text-center">
                <div className="text-sm text-neutral-600">
                  {t.hasAccount}{' '}
                  <Link href="/auth/sign-in" className="text-primary hover:underline">
                    {t.signInLink}
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
