"use client";
import { useCurrentUser } from "@/lib/session";
import { Skeleton } from "@/components/ui/skeleton";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchemaInputs, userSchema } from "../schemas";
import { useUpdateUserProfile } from "../hooks";
import { useEffect } from "react";

export default function Account() {
  const { user, isLoading } = useCurrentUser();
  const { mutate, isPending } = useUpdateUserProfile();
  const { register, handleSubmit, reset } = useForm<UserSchemaInputs>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        email: user.email ?? "",
        brandName: user.brandName ?? "",
        brandEmail: user.brandEmail ?? "",
        brandAddress: user.brandAddress ?? "",
      });
    }
  }, [reset, user]);

  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-2 gap-4">
        <Skeleton className="bg-slate-200 w-full h-20" />
        <Skeleton className="bg-slate-200 w-full h-20" />
        <Skeleton className="bg-slate-200 w-full h-20" />
        <Skeleton className="bg-slate-200 w-full h-20" />
        <Skeleton className="bg-slate-200 w-full h-20" />
        <Skeleton className="bg-slate-200 w-full h-20" />
      </div>
    );
  }

  if (user) {
    const onSubmit = (data: UserSchemaInputs) => {
      mutate(data);
    };
    return (
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full md:w-2/3">
          <FieldSet>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input {...register("name")} />
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" {...register("email")} />
              </Field>
              <Field>
                <FieldLabel>Company/Brand Name</FieldLabel>
                <Input {...register("brandName")} />
              </Field>
              <Field>
                <FieldLabel>Company/Brand Email</FieldLabel>
                <Input type="email" {...register("brandEmail")} />
              </Field>
              <Field>
                <FieldLabel>Company/Brand Address</FieldLabel>
                <Input {...register("brandAddress")} />
              </Field>
            </FieldGroup>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Note</FieldLabel>
                <Textarea className="max-h-[200px]" {...register("note")} />
              </Field>
              <Field>
                <FieldLabel>Terms</FieldLabel>
                <Textarea className="max-h-[200px]" {...register("terms")} />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Button type="submit" className="mt-4" disabled={isPending}>
            {isPending && <Spinner />}
            <span>Save Changes</span>
          </Button>
        </form>
      </div>
    );
  }
}
