-- Polygons table; points stored as JSONB: [[x,y], [x,y], ...]
create table if not exists polygons (
  id          bigserial primary key,
  name        text not null unique,
  points      jsonb not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint points_is_array check (jsonb_typeof(points) = 'array')
);

-- simple trigger to maintain updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_polygons_updated_at on polygons;
create trigger trg_polygons_updated_at
before update on polygons
for each row execute function set_updated_at();

-- helpful GIN index if you ever filter on points structure
create index if not exists idx_polygons_points_gin on polygons using gin (points);
