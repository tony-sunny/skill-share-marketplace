const shorthands = undefined;

export const up = (pgm) => {
  // Users table includes both users and providers
  pgm.createTable(
    "users",
    {
      id: "id", // serial PRIMARY KEY
      role: { type: "varchar(20)", notNull: true }, // 'user' or 'provider'
      role_type: { type: "varchar(20)", notNull: true }, // 'individual' or 'company'
      first_name: { type: "varchar(100)", notNull: true },
      last_name: { type: "varchar(100)", notNull: true },
      company_name: { type: "varchar(255)" },
      business_tax_number: { type: "varchar(10)" },
      email: { type: "varchar(255)", notNull: true, unique: true },
      phone: { type: "varchar(20)" },
      mobile: { type: "varchar(20)", notNull: true },
      address: { type: "text" },
      password_hash: { type: "varchar(255)", notNull: true },
      created_at: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("now()"),
      },
      updated_at: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("now()"),
      },
    },
    { ifNotExists: true },
  );

  pgm.createTable(
    "skills",
    {
      id: "id", // serial PRIMARY KEY
      user_id: {
        type: "integer",
        notNull: true,
        references: "users(id)",
        onDelete: "CASCADE",
      },
      category: { type: "varchar(100)", notNull: true },
      experience: { type: "varchar(100)" },
      nature_of_work: { type: "varchar(20)", notNull: true }, // onsite/online
      hourly_rate: { type: "numeric(10,2)", notNull: true },
      created_at: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("now()"),
      },
      updated_at: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("now()"),
      },
    },
    { ifNotExists: true },
  );

  pgm.createTable(
    "tasks",
    {
      id: "id", // serial PRIMARY KEY
      user_id: {
        type: "integer",
        notNull: true,
        references: "users(id)",
        onDelete: "CASCADE",
      },
      category: { type: "varchar(100)", notNull: true },
      name: { type: "varchar(255)", notNull: true },
      description: { type: "text" },
      expected_start_date: { type: "date" },
      expected_hours: { type: "integer" },
      hourly_rate: { type: "numeric(10,2)" },
      rate_currency: { type: "varchar(10)" },
      status: { type: "varchar(30)", notNull: true, default: "open" }, // open/completed/accepted
      created_at: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("now()"),
      },
      updated_at: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("now()"),
      },
    },
    { ifNotExists: true },
  );

  pgm.createTable(
    "offers",
    {
      id: "id", // serial PRIMARY KEY
      task_id: {
        type: "integer",
        notNull: true,
        references: "tasks(id)",
        onDelete: "CASCADE",
      },
      provider_id: {
        type: "integer",
        notNull: true,
        references: "users(id)",
        onDelete: "CASCADE",
      },
      status: { type: "varchar(20)", notNull: true, default: "pending" }, // pending/accepted/rejected
      created_at: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("now()"),
      },
      updated_at: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("now()"),
      },
    },
    { ifNotExists: true },
  );

  pgm.createTable(
    "task_progress",
    {
      id: "id", // serial PRIMARY KEY
      task_id: {
        type: "integer",
        notNull: true,
        references: "tasks(id)",
        onDelete: "CASCADE",
      },
      provider_id: {
        type: "integer",
        notNull: true,
        references: "users(id)",
        onDelete: "CASCADE",
      },
      task_progress: { type: "text", notNull: true },
      task_progress_updated_at: {
        type: "timestamp",
      },
      created_at: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("now()"),
      },
      updated_at: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("now()"),
      },
    },
    { ifNotExists: true },
  );
};

export const down = (pgm) => {
  pgm.dropTable("task_progress");
  pgm.dropTable("offers");
  pgm.dropTable("tasks");
  pgm.dropTable("skills");
  pgm.dropTable("users");
};
