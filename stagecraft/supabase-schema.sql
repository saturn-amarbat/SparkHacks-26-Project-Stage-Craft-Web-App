-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "vector";

-- Create profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  role text check (role in ('buyer', 'seller', 'both')) default 'buyer',
  created_at timestamp +with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create products table
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  category text check (category in ('Costume', 'Prop', 'Equipment')) not null,
  tags text[] default '{}',
  rental_price_per_day numeric(10, 2) not null,
  purchase_price numeric(10, 2),
  image_url text not null,
  owner_id uuid references profiles(id) on delete cascade not null,
  available boolean default true,
  embedding vector(1536), -- For semantic search
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create rentals table
create table if not exists rentals (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade not null,
  renter_id uuid references profiles(id) on delete cascade not null,
  owner_id uuid references profiles(id) on delete cascade not null,
  start_date date not null,
  end_date date not null,
  total_price numeric(10, 2) not null,
  status text check (status in ('pending', 'confirmed', 'active', 'completed', 'cancelled')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create cart_items table
create table if not exists cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  quantity integer default 1 check (quantity > 0),
  rental_start_date date,
  rental_end_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create gig_listings table (for social networking feature)
create table if not exists gig_listings (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  production_type text not null,
  role_name text,
  location text not null,
  audition_date date,
  performance_dates text,
  posted_by uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create orders table
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  buyer_id uuid references profiles(id) on delete cascade not null,
  total_amount numeric(10, 2) not null,
  status text check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create order_items table
create table if not exists order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  quantity integer default 1 check (quantity > 0),
  price_per_item numeric(10, 2) not null,
  is_rental boolean default false,
  rental_start_date date,
  rental_end_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index if not exists products_owner_id_idx on products(owner_id);
create index if not exists products_category_idx on products(category);
create index if not exists rentals_product_id_idx on rentals(product_id);
create index if not exists rentals_renter_id_idx on rentals(renter_id);
create index if not exists rentals_dates_idx on rentals(start_date, end_date);
create index if not exists cart_items_user_id_idx on cart_items(user_id);
create index if not exists gig_listings_posted_by_idx on gig_listings(posted_by);

-- Create function for semantic search
create or replace function match_products (
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count int default 5
)
returns table (
  id uuid,
  name text,
  description text,
  category text,
  rental_price_per_day numeric,
  image_url text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    products.id,
    products.name,
    products.description,
    products.category,
    products.rental_price_per_day,
    products.image_url,
    1 - (products.embedding <=> query_embedding) as similarity
  from products
  where
    products.available = true
    and 1 - (products.embedding <=> query_embedding) > match_threshold
  order by products.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Enable Row Level Security
alter table profiles enable row level security;
alter table products enable row level security;
alter table rentals enable row level security;
alter table cart_items enable row level security;
alter table gig_listings enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- RLS Policies for profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- RLS Policies for products
create policy "Products are viewable by everyone"
  on products for select
  using (true);

create policy "Users can insert their own products"
  on products for insert
  with check (auth.uid() = owner_id);

create policy "Users can update their own products"
  on products for update
  using (auth.uid() = owner_id);

create policy "Users can delete their own products"
  on products for delete
  using (auth.uid() = owner_id);

-- RLS Policies for rentals
create policy "Users can view their own rentals"
  on rentals for select
  using (auth.uid() = renter_id or auth.uid() = owner_id);

create policy "Users can create rentals"
  on rentals for insert
  with check (auth.uid() = renter_id);

create policy "Renters and owners can update rentals"
  on rentals for update
  using (auth.uid() = renter_id or auth.uid() = owner_id);

-- RLS Policies for cart_items
create policy "Users can view their own cart"
  on cart_items for select
  using (auth.uid() = user_id);

create policy "Users can add to their own cart"
  on cart_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own cart"
  on cart_items for update
  using (auth.uid() = user_id);

create policy "Users can delete from their own cart"
  on cart_items for delete
  using (auth.uid() = user_id);

-- RLS Policies for gig_listings
create policy "Gig listings are viewable by everyone"
  on gig_listings for select
  using (true);

create policy "Users can create gig listings"
  on gig_listings for insert
  with check (auth.uid() = posted_by);

create policy "Users can update their own gig listings"
  on gig_listings for update
  using (auth.uid() = posted_by);

create policy "Users can delete their own gig listings"
  on gig_listings for delete
  using (auth.uid() = posted_by);

-- RLS Policies for orders
create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = buyer_id);

create policy "Users can create orders"
  on orders for insert
  with check (auth.uid() = buyer_id);

-- RLS Policies for order_items
create policy "Users can view their own order items"
  on order_items for select
  using (
    auth.uid() in (
      select buyer_id from orders where id = order_items.order_id
    )
  );

-- Function to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at_column();

create trigger update_products_updated_at before update on products
  for each row execute procedure update_updated_at_column();

create trigger update_rentals_updated_at before update on rentals
  for each row execute procedure update_updated_at_column();

create trigger update_gig_listings_updated_at before update on gig_listings
  for each row execute procedure update_updated_at_column();

create trigger update_orders_updated_at before update on orders
  for each row execute procedure update_updated_at_column();
