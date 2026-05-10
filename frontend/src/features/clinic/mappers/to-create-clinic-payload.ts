import type { CreateClinicCommand } from "../contracts/create-clinic-command";

export const toCreateClinicPayload = ({ values }: CreateClinicCommand) => {
  return {
    name: values.name,
  };
};
