import { useState, useMemo } from "react";
import type * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { LogoMark } from "@/presentation/components/domain/logo-mark";
import type { AuthViewModel } from "@/application/view-models/auth.vm";

export function SignUpView(props: AuthViewModel): React.ReactElement {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        firstName: z.string().min(1, t("signup.firstNameRequired")),
        lastName: z.string().min(1, t("signup.lastNameRequired")),
        email: z.string().min(1, t("signup.emailRequired")).email(t("signup.emailInvalid")),
        password: z
          .string()
          .min(8, t("signup.passwordRule"))
          .regex(/[A-Z]/, t("signup.passwordRule"))
          .regex(/[a-z]/, t("signup.passwordRule"))
          .regex(/[0-9]/, t("signup.passwordRule")),
      }),
    [t],
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
    mode: "onTouched",
  });

  const onValid = () => {
    props.onSubmit();
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-background px-(--container-padding) py-(--section-gap)">
      <div className="flex w-full max-w-sm flex-col items-center gap-(--section-gap) text-center">
        <div className="flex flex-col items-center gap-2">
          <LogoMark className="size-10" />
          <span className="type-row-title text-foreground">Market Beacon</span>
        </div>

        <header className="flex flex-col items-center gap-2">
          <h1 className="type-page-title text-foreground [overflow-wrap:anywhere]">
            {t("signup.title")}
          </h1>
          <p className="type-body text-text-muted">{t("signup.subtitle")}</p>
        </header>

        <Card className="w-full border border-border bg-card text-left">
          <CardContent className="p-(--card-padding)">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void form.handleSubmit(onValid)(e);
              }}
              noValidate
            >
              <FieldGroup>
                <Controller
                  name="firstName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="firstName">{t("signup.firstName")}</FieldLabel>
                      <Input
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          props.onFirstNameChange(e.target.value);
                        }}
                        id="firstName"
                        autoComplete="given-name"
                        aria-invalid={fieldState.invalid}
                        className="min-h-11 border-border-strong"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="lastName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="lastName">{t("signup.lastName")}</FieldLabel>
                      <Input
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          props.onLastNameChange(e.target.value);
                        }}
                        id="lastName"
                        autoComplete="family-name"
                        aria-invalid={fieldState.invalid}
                        className="min-h-11 border-border-strong"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">{t("signup.email")}</FieldLabel>
                      <Input
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          props.onEmailChange(e.target.value);
                        }}
                        id="email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={fieldState.invalid}
                        className="min-h-11 border-border-strong"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password">{t("signup.password")}</FieldLabel>
                      <div className="flex items-center rounded-control border border-border-strong bg-background focus-within:ring-2 focus-within:ring-ring">
                        <Input
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            props.onPasswordChange(e.target.value);
                          }}
                          id="password"
                          type={show ? "text" : "password"}
                          autoComplete="new-password"
                          aria-invalid={fieldState.invalid}
                          className="min-h-11 min-w-0 flex-1 border-0 bg-transparent focus-visible:ring-0"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-11 shrink-0"
                          aria-label={show ? t("signup.hidePassword") : t("signup.showPassword")}
                          aria-pressed={show}
                          onClick={() => setShow((s) => !s)}
                        >
                          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </Button>
                      </div>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {props.error && (
                  <p
                    role="alert"
                    className="type-meta flex items-start gap-2 rounded-control bg-status-danger-bg p-3 text-status-danger-ink"
                  >
                    <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>{props.error}</span>
                  </p>
                )}

                <Button type="submit" className="min-h-11 w-full" disabled={props.loading}>
                  {props.loading ? (
                    <>
                      <Spinner className="size-4" /> {t("signup.creating")}
                    </>
                  ) : (
                    t("signup.submit")
                  )}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <p className="type-caption text-text-muted">
          {t("signup.haveAccount")}{" "}
          <Button
            type="button"
            variant="link"
            className="type-caption h-auto p-0 text-text-link hover:underline"
            onClick={() => props.navigate("/login")}
          >
            {t("signup.signIn")}
          </Button>
        </p>
      </div>
    </main>
  );
}
