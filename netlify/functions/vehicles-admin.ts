import type { Handler } from "@netlify/functions";
import { Pool } from "pg";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

const getRequiredEnv = (key: string) => {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
};

const normalizeEnvValue = (value: string) => {
  const trimmed = value.trim();
  const isWrapped =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith("`") && trimmed.endsWith("`"));
  return isWrapped ? trimmed.slice(1, -1).trim() : trimmed;
};

const normalizeFirebasePrivateKey = (value: string) => {
  let v = normalizeEnvValue(value);
  if (v.startsWith("{")) {
    try {
      const parsed = JSON.parse(v) as { private_key?: unknown };
      if (typeof parsed.private_key === "string") v = parsed.private_key;
    } catch {
      // ignore
    }
  }
  v = v.replace(/\\n/g, "\n").trim();
  if (!v.includes("BEGIN PRIVATE KEY") || !v.includes("END PRIVATE KEY")) {
    throw new Error(
      "Invalid FIREBASE_ADMIN_PRIVATE_KEY. Paste the full 'private_key' value from the Firebase service account JSON.",
    );
  }
  return v;
};

const validateDbConnectionString = (connectionString: string) => {
  const raw = normalizeEnvValue(connectionString);
  const candidate = raw.toLowerCase().startsWith("psql ") ? raw.slice("psql ".length).trim() : raw;
  const idx = candidate.search(/postgres(ql)?:\/\//i);
  const extracted =
    idx >= 0
      ? candidate
          .slice(idx)
          .trim()
          .replace(/^['"`]+/, "")
          .replace(/['"`]+$/, "")
          .split(/\s+/)[0]
      : candidate;
  const match = extracted.match(/postgres(ql)?:\/\/[^'"\s]+/i);
  const v = match ? match[0] : extracted;
  if (!/^postgres(ql)?:\/\//i.test(v)) {
    const startsWithPsql = raw.toLowerCase().startsWith("psql ");
    const containsPostgres = /postgres(ql)?:\/\//i.test(raw);
    const info = `startsWithPsql=${startsWithPsql}, containsPostgres=${containsPostgres}`;
    throw new Error(`Invalid NEON_DATABASE_URL. Expected a postgres:// connection string. ${info}`);
  }
  try {
    const url = new URL(v);
    if (!url.hostname) {
      throw new Error("Invalid NEON_DATABASE_URL. Missing hostname.");
    }
    if (url.hostname.toLowerCase() === "base") {
      throw new Error("Invalid NEON_DATABASE_URL. Hostname is 'base'.");
    }
  } catch {
    throw new Error("Invalid NEON_DATABASE_URL. Unable to parse connection string.");
  }
  return v;
};

const getFirebaseAuth = () => {
  if (!getApps().length) {
    const projectId = normalizeEnvValue(getRequiredEnv("FIREBASE_ADMIN_PROJECT_ID"));
    const clientEmail = normalizeEnvValue(getRequiredEnv("FIREBASE_ADMIN_CLIENT_EMAIL"));
    const privateKey = normalizeFirebasePrivateKey(getRequiredEnv("FIREBASE_ADMIN_PRIVATE_KEY"));

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
  return getAuth();
};

const getPool = () => {
  if (pool) return pool;
  const connectionString = validateDbConnectionString(
    process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL ?? getRequiredEnv("NEON_DATABASE_URL"),
  );
  const needsSsl = !connectionString.includes("localhost") && !connectionString.includes("127.0.0.1");
  pool = new Pool({
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    max: 5,
    connectionTimeoutMillis: 8000,
    query_timeout: 15000,
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

const requireAuth = async (event: Parameters<Handler>[0]) => {
  const authHeader = event.headers.authorization ?? event.headers.Authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;
  if (!token) return null;
  return getFirebaseAuth().verifyIdToken(token);
};

const parseJson = (body: string | null) => {
  if (!body) return null;
  try {
    return JSON.parse(body) as unknown;
  } catch {
    return null;
  }
};

export const handler: Handler = async (event) => {
  try {
    const decoded = await requireAuth(event);
    if (!decoded) return { statusCode: 401, body: "Unauthorized" };

    if (!schemaReady) schemaReady = ensureSchema();
    await schemaReady;

    const p = getPool();

    if (event.httpMethod === "GET") {
      const id = event.queryStringParameters?.id?.trim();
      if (id) {
        const result = await p.query(`select * from vehicles where id = $1 limit 1`, [id]);
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
        order by created_at desc
        limit 1000
      `);
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ vehicles: result.rows.map(toApiVehicle) }),
      };
    }

    if (event.httpMethod === "POST") {
      const parsed = parseJson(event.body);
      if (!parsed || typeof parsed !== "object") return { statusCode: 400, body: "Invalid JSON" };

      const v = parsed as Record<string, unknown>;
      const id = typeof v.id === "string" && v.id.trim().length > 0 ? v.id.trim() : crypto.randomUUID();

      const images = Array.isArray(v.images) ? (v.images.filter((x) => typeof x === "string") as string[]) : [];
      const features = Array.isArray(v.features) ? (v.features.filter((x) => typeof x === "string") as string[]) : [];

      const make = typeof v.make === "string" ? v.make.trim() : "";
      const model = typeof v.model === "string" ? v.model.trim() : "";
      const stockNumber = typeof v.stockNumber === "string" ? v.stockNumber.trim() : "";
      const branch = typeof v.branch === "string" ? v.branch.trim() : "";

      if (!make || !model || !stockNumber || !branch) {
        return { statusCode: 400, body: "Missing required fields" };
      }
      if (!images.length) return { statusCode: 400, body: "At least one image is required" };

      const purchaseDate = typeof v.purchaseDate === "string" && v.purchaseDate.trim().length > 0 ? v.purchaseDate : null;

      const params = {
        id,
        make,
        model,
        variant: typeof v.variant === "string" ? v.variant : null,
        year: typeof v.year === "number" ? v.year : Number(v.year),
        price: typeof v.price === "number" ? v.price : Number(v.price),
        original_price: v.originalPrice == null ? null : Number(v.originalPrice),
        est_monthly_payment: v.estMonthlyPayment == null ? null : Number(v.estMonthlyPayment),
        mileage: typeof v.mileage === "number" ? v.mileage : Number(v.mileage),
        fuel_type: typeof v.fuelType === "string" ? v.fuelType : null,
        transmission: typeof v.transmission === "string" ? v.transmission : null,
        body_type: typeof v.bodyType === "string" ? v.bodyType : null,
        condition: typeof v.condition === "string" ? v.condition : null,
        drive: typeof v.drive === "string" ? v.drive : null,
        seats: v.seats == null ? null : Number(v.seats),
        color: typeof v.color === "string" ? v.color : null,
        engine_size: typeof v.engineSize === "string" ? v.engineSize : null,
        description: typeof v.description === "string" ? v.description : null,
        images,
        features,
        is_special_offer: typeof v.isSpecialOffer === "boolean" ? v.isSpecialOffer : null,
        status: typeof v.status === "string" ? v.status : "draft",
        vin: typeof v.vin === "string" ? v.vin : null,
        engine_number: typeof v.engineNumber === "string" ? v.engineNumber : null,
        registration_number: typeof v.registrationNumber === "string" ? v.registrationNumber : null,
        stock_number: stockNumber,
        cost_price: v.costPrice == null ? null : Number(v.costPrice),
        reconditioning_cost: v.reconditioningCost == null ? null : Number(v.reconditioningCost),
        natis_number: typeof v.natisNumber === "string" ? v.natisNumber : null,
        previous_owner: typeof v.previousOwner === "string" ? v.previousOwner : null,
        key_number: typeof v.keyNumber === "string" ? v.keyNumber : null,
        supplier: typeof v.supplier === "string" ? v.supplier : null,
        purchase_date: purchaseDate,
        branch,
        service_history: typeof v.serviceHistory === "boolean" ? v.serviceHistory : null,
        warranty_months: v.warrantyMonths == null ? null : Number(v.warrantyMonths),
      };

      const result = await p.query(
        `
          insert into vehicles (
            id, make, model, variant, year, price, original_price, est_monthly_payment, mileage, fuel_type,
            transmission, body_type, condition, drive, seats, color, engine_size, description, images, features,
            is_special_offer, status, vin, engine_number, registration_number, stock_number, cost_price,
            reconditioning_cost, natis_number, previous_owner, key_number, supplier, purchase_date, branch,
            service_history, warranty_months
          )
          values (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
            $21, $22, $23, $24, $25, $26, $27,
            $28, $29, $30, $31, $32, $33, $34,
            $35, $36
          )
          on conflict (id) do update set
            make = excluded.make,
            model = excluded.model,
            variant = excluded.variant,
            year = excluded.year,
            price = excluded.price,
            original_price = excluded.original_price,
            est_monthly_payment = excluded.est_monthly_payment,
            mileage = excluded.mileage,
            fuel_type = excluded.fuel_type,
            transmission = excluded.transmission,
            body_type = excluded.body_type,
            condition = excluded.condition,
            drive = excluded.drive,
            seats = excluded.seats,
            color = excluded.color,
            engine_size = excluded.engine_size,
            description = excluded.description,
            images = excluded.images,
            features = excluded.features,
            is_special_offer = excluded.is_special_offer,
            status = excluded.status,
            vin = excluded.vin,
            engine_number = excluded.engine_number,
            registration_number = excluded.registration_number,
            stock_number = excluded.stock_number,
            cost_price = excluded.cost_price,
            reconditioning_cost = excluded.reconditioning_cost,
            natis_number = excluded.natis_number,
            previous_owner = excluded.previous_owner,
            key_number = excluded.key_number,
            supplier = excluded.supplier,
            purchase_date = excluded.purchase_date,
            branch = excluded.branch,
            service_history = excluded.service_history,
            warranty_months = excluded.warranty_months,
            updated_at = now()
          returning *
        `,
        [
          params.id,
          params.make,
          params.model,
          params.variant,
          params.year,
          params.price,
          params.original_price,
          params.est_monthly_payment,
          params.mileage,
          params.fuel_type,
          params.transmission,
          params.body_type,
          params.condition,
          params.drive,
          params.seats,
          params.color,
          params.engine_size,
          params.description,
          params.images,
          params.features,
          params.is_special_offer,
          params.status,
          params.vin,
          params.engine_number,
          params.registration_number,
          params.stock_number,
          params.cost_price,
          params.reconditioning_cost,
          params.natis_number,
          params.previous_owner,
          params.key_number,
          params.supplier,
          params.purchase_date,
          params.branch,
          params.service_history,
          params.warranty_months,
        ],
      );

      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ vehicle: toApiVehicle(result.rows[0]) }),
      };
    }

    if (event.httpMethod === "DELETE") {
      const id = event.queryStringParameters?.id?.trim();
      if (!id) return { statusCode: 400, body: "Missing id" };
      await p.query(`delete from vehicles where id = $1`, [id]);
      return { statusCode: 204, body: "" };
    }

    return { statusCode: 405, body: "Method Not Allowed" };
  } catch (e: unknown) {
    const message =
      e && typeof e === "object" && "message" in e && typeof (e as { message?: unknown }).message === "string"
        ? (e as { message: string }).message
        : "Internal Server Error";
    return { statusCode: 500, body: message };
  }
};
