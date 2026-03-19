-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Boards table
create table boards (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text default '#6366f1',
  created_at timestamptz default now() not null
);

-- Columns table
create table columns (
  id uuid primary key default uuid_generate_v4(),
  board_id uuid references boards(id) on delete cascade not null,
  name text not null,
  position integer not null default 0,
  created_at timestamptz default now() not null
);

-- Cards table
create table cards (
  id uuid primary key default uuid_generate_v4(),
  column_id uuid references columns(id) on delete cascade not null,
  title text not null,
  description text,
  color text default '#ffffff',
  position integer not null default 0,
  created_at timestamptz default now() not null
);

-- Row Level Security
alter table boards enable row level security;
alter table columns enable row level security;
alter table cards enable row level security;

-- RLS Policies for boards
create policy "Users can view their own boards"
  on boards for select
  using (auth.uid() = user_id);

create policy "Users can create boards"
  on boards for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own boards"
  on boards for update
  using (auth.uid() = user_id);

create policy "Users can delete their own boards"
  on boards for delete
  using (auth.uid() = user_id);

-- RLS Policies for columns (via board ownership)
create policy "Users can view columns of their boards"
  on columns for select
  using (
    exists (
      select 1 from boards
      where boards.id = columns.board_id
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can create columns in their boards"
  on columns for insert
  with check (
    exists (
      select 1 from boards
      where boards.id = columns.board_id
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can update columns in their boards"
  on columns for update
  using (
    exists (
      select 1 from boards
      where boards.id = columns.board_id
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can delete columns in their boards"
  on columns for delete
  using (
    exists (
      select 1 from boards
      where boards.id = columns.board_id
      and boards.user_id = auth.uid()
    )
  );

-- RLS Policies for cards (via column → board ownership)
create policy "Users can view cards in their boards"
  on cards for select
  using (
    exists (
      select 1 from columns
      join boards on boards.id = columns.board_id
      where columns.id = cards.column_id
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can create cards in their boards"
  on cards for insert
  with check (
    exists (
      select 1 from columns
      join boards on boards.id = columns.board_id
      where columns.id = cards.column_id
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can update cards in their boards"
  on cards for update
  using (
    exists (
      select 1 from columns
      join boards on boards.id = columns.board_id
      where columns.id = cards.column_id
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can delete cards in their boards"
  on cards for delete
  using (
    exists (
      select 1 from columns
      join boards on boards.id = columns.board_id
      where columns.id = cards.column_id
      and boards.user_id = auth.uid()
    )
  );
