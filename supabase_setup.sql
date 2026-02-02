-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CLIENTS (Dealerships)
create table public.clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  owner_name text,
  email text,
  phone text,
  status text check (status in ('Active', 'Suspended', 'Onboarding')),
  tier text check (tier in ('Basic', 'Professional', 'Enterprise')),
  joined_date timestamp with time zone default now(),
  next_billing_date timestamp with time zone,
  active_features text[] default '{}', -- Array of Feature IDs
  created_at timestamp with time zone default now()
);

-- 2. PROFILES (Users linked to Auth and Clients)
-- Note: This extends the built-in auth.users table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  client_id uuid references public.clients(id),
  full_name text,
  role text check (role in ('SuperAdmin', 'Admin', 'Sales', 'Manager')),
  created_at timestamp with time zone default now()
);

-- 3. VEHICLES
create table public.vehicles (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) not null,
  stock_number text,
  make text not null,
  model text not null,
  variant text,
  year integer,
  price numeric,
  mileage integer,
  color text,
  vin text,
  status text check (status in ('available', 'reserved', 'sold', 'draft')),
  images text[], -- Array of image URLs
  created_at timestamp with time zone default now()
);

-- 4. LEADS (CRM)
create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) not null,
  customer_name text not null,
  email text,
  phone text,
  source text,
  status text check (status in ('new', 'contacted', 'test-drive', 'finance', 'negotiation', 'sold', 'lost', 'rejected')),
  vehicle_ids uuid[], -- Array of vehicle IDs interested in
  assigned_to uuid references public.profiles(id),
  created_at timestamp with time zone default now()
);

-- 5. TICKETS (Support)
create table public.tickets (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) not null,
  subject text not null,
  status text check (status in ('Open', 'In Progress', 'Resolved')),
  priority text check (priority in ('Low', 'Medium', 'High')),
  created_at timestamp with time zone default now()
);

-- 6. TICKET MESSAGES
create table public.ticket_messages (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid references public.tickets(id) on delete cascade not null,
  sender_type text check (sender_type in ('user', 'support')),
  message text not null,
  created_at timestamp with time zone default now()
);

-- ROW LEVEL SECURITY (RLS) BASICS
-- Enable RLS
alter table clients enable row level security;
alter table vehicles enable row level security;
alter table leads enable row level security;
alter table tickets enable row level security;

-- Policy: Users can only see data belonging to their client_id
create policy "Users can view their own client data" on clients
  for select using (id in (select client_id from profiles where profiles.id = auth.uid()));

create policy "Users can view vehicles of their client" on vehicles
  for select using (client_id in (select client_id from profiles where profiles.id = auth.uid()));
