import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  SettingsFormInput,
  settingsFormSchema,
  SettingsFormValues,
} from "@/modules/settings/schemas/settings.schema";
import {
  maskBusinessHoursInput,
  normalizeBusinessHoursInput,
} from "@/shared/utils/date";

type Props = {
  defaultValues: SettingsFormValues;
  loading?: boolean;
  onSubmit: (values: SettingsFormValues) => Promise<void>;
};

export function SettingsForm({
  defaultValues,
  loading = false,
  onSubmit,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormInput, unknown, SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Card style={styles.form}>
      <Controller
        control={control}
        name="clinic_name"
        render={({ field }) => (
          <Input
            label="Nome da clinica/profissional"
            placeholder="Ex.: Clinica Central"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.clinic_name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="currency"
        render={({ field }) => (
          <Input
            label="Moeda"
            placeholder="BRL"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={3}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.currency?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="default_session_minutes"
        render={({ field }) => (
          <Input
            label="Duracao padrao da sessao (min)"
            placeholder="50"
            keyboardType="number-pad"
            value={String(field.value ?? "")}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.default_session_minutes?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="default_business_hours"
        render={({ field }) => (
          <Input
            label="Horario padrao (opcional)"
            placeholder="08:00-18:00"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="number-pad"
            value={field.value ?? ""}
            onChangeText={(value) =>
              field.onChange(maskBusinessHoursInput(value))
            }
            onBlur={field.onBlur}
            error={errors.default_business_hours?.message}
          />
        )}
      />

      <View style={styles.action}>
        <Button
          label="Salvar configuracoes"
          onPress={handleSubmit(async (values) =>
            onSubmit({
              ...values,
              default_business_hours:
                normalizeBusinessHoursInput(
                  values.default_business_hours ?? "",
                ) ?? values.default_business_hours,
            }),
          )}
          loading={loading || isSubmitting}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
  action: {
    marginTop: 4,
  },
});
