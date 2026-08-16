-- ============================================================
-- PLATAFORMAS WEB — Schema Supabase
-- Proyecto: https://egcaxyxfmajetoajktps.supabase.co
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. CLIENTES
--    Campo entorno_tbk agregado: actualizarCliente.cjs lo guarda
--    al registrar/actualizar tbk_user (PRODUCCION / INTEGRACION)
create table if not exists clientes (
  id             serial primary key,
  nombre         text not null,
  sitio_web      text,
  url            text,
  telefono       text,
  correo         text,
  pagado         boolean default false,
  valor          text default '$10.000',
  fecha_pago     date,
  estado         boolean default true,
  logo_url       text,
  internacional  boolean default false,
  suscripcion    boolean default false,
  tbk_user       text,
  tarjeta        text,
  tipo_tarjeta   text,
  entorno_tbk    text,
  created_at     timestamptz default now()
);

-- 2. TRABAJOS (proyectos en desarrollo)
create table if not exists trabajos (
  id               serial primary key,
  sitio_web        text not null,
  nombre_cliente   text,
  email_cliente    text,
  telefono_cliente text,
  logo_cliente     text,
  porcentaje       integer default 0,
  estado           boolean default true,
  tipo_app         integer,
  origen           text null default 'manual',
  ocultar          boolean null default false,
  created_at       timestamptz default now()
);

-- 3. TRABAJOS EN REVISIÓN
create table if not exists trabajos_revision (
  id               serial primary key,
  negocio          text not null,
  email_cliente    text,
  telefono_cliente text,
  porcentaje       integer default 0,
  estado           integer default 1,  -- 1=en revisión, 2=completado
  revision         integer default 0,
  created_at       timestamptz default now()
);

-- 4. SERVICIOS
create table if not exists servicios (
  id           serial primary key,
  titulo       text,
  imagen       text,
  link         text,
  descripcion  text,
  background   text,
  icono_nombre text,
  orden        integer default 0
);

create table if not exists servicio_secciones (
  id          serial primary key,
  servicio_id integer references servicios(id) on delete cascade,
  titulo      text,
  descripcion text,
  imagen      text,
  items       text[]
);

-- 5. PASE MENSUAL (misiones por cliente)
create table if not exists pase_mensual (
  id                             serial primary key,
  sitio_web                      text unique not null,
  compartir_anuncio              integer default 0,
  compartir_anuncio_estado       integer default 0,
  pagar_suscripcion_antes        integer default 0,
  pagar_suscripcion_antes_estado integer default 0,
  conexion_mensual               integer default 0,
  conexion_mensual_estado        integer default 0,
  visitas_mensual                integer default 0,
  visitas_mensual_estado         integer default 0,
  conseguir_cliente              integer default 0,
  conseguir_cliente_estado       integer default 0,
  fecha_edicion                  timestamptz default now()
);

-- 6. RESERVAS (transacciones Transbank WebpayPlus)
create table if not exists reservas (
  id                 serial primary key,
  email              text,
  buy_order          text unique,
  session_id         text,
  token_ws           text unique,
  amount             numeric,
  status             text,
  authorization_code text,
  payment_type       text,
  installments       integer default 0,
  card_number        text,
  transaction_date   text,
  accounting_date    text,
  response_code      integer,
  commerce_code      text,
  environment        text,
  created_at         timestamptz default now()
);

-- 7. SUSCRIPCIONES PAYPAL
--    Campo plan_mode agregado: suscribirse.cjs guarda paypalPlanMode (test/standard)
create table if not exists suscripciones_paypal (
  id              serial primary key,
  cliente_id      integer references clientes(id),
  nombre          text,
  email           text,
  sitio_web       text,
  subscription_id text unique,
  plan_id         text,
  plan_mode       text,
  entorno         text,
  approval_url    text,
  created_at      timestamptz default now()
);

-- 8. TOKENS TBK (temporal — flujo inscripción Transbank OneClick)
--    Antes se guardaban en S3 como tokens/{token}.json
--    confirmarSuscripcion.cjs los lee para saber a qué cliente asignar tbk_user
create table if not exists tokens_tbk (
  id              serial primary key,
  token           text unique not null,
  cliente_id      integer references clientes(id),
  nombre          text,
  email           text,
  sitio_web       text,
  entorno         text,
  came_from_local boolean default false,
  confirmado      boolean default false,
  created_at      timestamptz default now()
);

-- 9. CONFIG (reemplaza Seguridad.xlsx — clave/valor global)
create table if not exists config (
  id    serial primary key,
  clave text unique not null,
  valor text
);

insert into config (clave, valor)
values ('con_cupos', 'true')
on conflict (clave) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Habilitado en todas las tablas.
-- Política temporal "allow_all" para que la anon key funcione
-- mientras no esté configurado el auth.
-- Reemplazar por políticas de rol antes de producción.
-- ============================================================

alter table clientes              enable row level security;
alter table trabajos              enable row level security;
alter table trabajos_revision     enable row level security;
alter table servicios             enable row level security;
alter table servicio_secciones    enable row level security;
alter table pase_mensual          enable row level security;
alter table reservas              enable row level security;
alter table suscripciones_paypal  enable row level security;
alter table tokens_tbk            enable row level security;
alter table config                enable row level security;

create policy "allow_all_clientes"             on clientes              for all using (true) with check (true);
create policy "allow_all_trabajos"             on trabajos              for all using (true) with check (true);
create policy "allow_all_trabajos_revision"    on trabajos_revision     for all using (true) with check (true);
create policy "allow_all_servicios"            on servicios             for all using (true) with check (true);
create policy "allow_all_servicio_secciones"   on servicio_secciones    for all using (true) with check (true);
create policy "allow_all_pase_mensual"         on pase_mensual          for all using (true) with check (true);
create policy "allow_all_reservas"             on reservas              for all using (true) with check (true);
create policy "allow_all_suscripciones_paypal" on suscripciones_paypal  for all using (true) with check (true);
create policy "allow_all_tokens_tbk"           on tokens_tbk            for all using (true) with check (true);
create policy "allow_all_config"               on config                for all using (true) with check (true);
