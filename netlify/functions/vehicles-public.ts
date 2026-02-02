import type { Handler } from "@netlify/functions";
import { Pool } from "pg";

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

const getRequiredEnv = (key: string) => {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
};

const getPool = () => {
  if (pool) return pool;
  const connectionString = process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL ?? getRequiredEnv("NEON_DATABASE_URL");
  const needsSsl = !connectionString.includes("localhost") && !connectionString.includes("127.0.0.1");
  pool = new Pool({
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    max: 5,
  });
  return pool;
};

const ensureSchema = async () => {
  const p = getPool();
  await p.query(`
    create table if not exists vehicles (
      id text primary key,
      make text not null,
      model text not null,
      variant text,
      year int not null,
      price numeric not null,
      original_price numeric,
      est_monthly_payment numeric,
      mileage int not null,
      fuel_type text not null,
      transmission text not null,
      body_type text not null,
      condition text not null,
      drive text,
      seats int,
      color text not null,
      engine_size text,
      description text,
      images text[] not null,
      features text[] not null,
      is_special_offer boolean,
      status text not null,
      vin text,
      engine_number text,
      registration_number text,
      stock_number text not null,
      cost_price numeric,
      reconditioning_cost numeric,
      natis_number text,
      previous_owner text,
      key_number text,
      supplier text,
      purchase_date date,
      branch text not null,
      service_history boolean,
      warranty_months int,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);
  await p.query(`create index if not exists vehicles_status_idx on vehicles(status);`);
  await p.query(`create index if not exists vehicles_created_at_idx on vehicles(created_at desc);`);
};

const toApiVehicle = (row: Record<string, unknown>) => {
  return {
    id: row.id,
    make: row.make,
    model: row.model,
    variant: row.variant,
    year: row.year,
    price: row.price,
    originalPrice: row.original_price,
    estMonthlyPayment: row.est_monthly_payment,
    mileage: row.mileage,
    fuelType: row.fuel_type,
    transmission: row.transmission,
    bodyType: row.body_type,
    condition: row.condition,
    drive: row.drive,
    seats: row.seats,
    color: row.color,
    engineSize: row.engine_size,
    description: row.description,
    images: row.images,
    features: row.features,
    isSpecialOffer: row.is_special_offer,
    status: row.status,
    vin: row.vin,
    engineNumber: row.engine_number,
    registrationNumber: row.registration_number,
    stockNumber: row.stock_number,
    costPrice: row.cost_price,
    reconditioningCost: row.reconditioning_cost,
    natisNumber: row.natis_number,
    previousOwner: row.previous_owner,
    keyNumber: row.key_number,
    supplier: row.supplier,
    purchaseDate: row.purchase_date,
    branch: row.branch,
    serviceHistory: row.service_history,
    warrantyMonths: row.warranty_months,
    createdAt: row.created_at,
  };
};

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "GET") return { statusCode: 405, body: "Method Not Allowed" };

    if (!schemaReady) schemaReady = ensureSchema();
    await schemaReady;

    const id = event.queryStringParameters?.id?.trim();

    const p = getPool();
    if (id) {
      const result = await p.query(
        `
          select *
          from vehicles
          where id = $1 and status = 'available'
          limit 1
        `,
        [id],
      );
      const row = result.rows[0];
      if (!row) return { statusCode: 404, body: "Not Found" };
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ vehicle: toApiVehicle(row) }),
      };
    }

    const result = await p.query(`
      select *
      from vehicles
      where status = 'available'
      order by created_at desc
      limit 500
    `);

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ vehicles: result.rows.map(toApiVehicle) }),
    };
  } catch (e: unknown) {
    const message =
      e && typeof e === "object" && "message" in e && typeof (e as { message?: unknown }).message === "string"
        ? (e as { message: string }).message
        : "Internal Server Error";
    return { statusCode: 500, body: message };
  }
};

