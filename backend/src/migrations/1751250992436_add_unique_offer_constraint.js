export const up = (pgm) => {
  pgm.addConstraint("offers", "offers_task_id_provider_id_unique", {
    unique: ["task_id", "provider_id"],
  });
};

export const down = (pgm) => {
  pgm.dropConstraint("offers", "offers_task_id_provider_id_unique");
};
